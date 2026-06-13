DIFFICULTY_ACTIONS = ["next_easy", "next_medium", "next_hard"]
SUPPORT_ACTIONS = [
    "simple_hint", "detailed_hint", "explanation", "worked_example",
    "easier_task", "similar_task", "retry_same_task", "revision_note"
]
EXPECTED_TIME = {"easy": 45, "medium": 90, "hard": 150}


def mastery_label(p):
    if p < 0.40: return "low"
    if p < 0.70: return "medium"
    return "high"


def get_time_status(seconds, difficulty):
    return "slow" if seconds > EXPECTED_TIME.get(difficulty, 90) else "normal"


def get_attempt_bucket(attempt_no):
    return "attempt_2_plus" if attempt_no >= 2 else "attempt_1"


def answer_status(is_correct):
    return "correct" if is_correct else "wrong"


def difficulty_action_to_label(action):
    return {"next_easy": "easy", "next_medium": "medium", "next_hard": "hard"}[action]


def calculate_difficulty_reward(is_correct, is_stuck, mastery_level_value, action):
    reward = 8 if is_correct else -4
    if is_stuck: reward -= 6
    if mastery_level_value == "low" and action == "next_easy": reward += 4
    if mastery_level_value == "medium" and action == "next_medium": reward += 4
    if mastery_level_value == "high" and action == "next_hard": reward += 4
    if mastery_level_value == "low" and action == "next_hard": reward -= 5
    if mastery_level_value == "high" and action == "next_easy": reward -= 2
    return reward


class DifficultyAnalysisWithBKTRL:
    def __init__(self, bkt_model, difficulty_rl_agent, support_rl_agent):
        self.bkt_model = bkt_model
        self.rl_agent = difficulty_rl_agent
        self.support_agent = support_rl_agent

    def analyze(self, interaction):
        student_id = interaction["student_id"]
        concept = interaction["concept"]
        current_difficulty = interaction["difficulty"]
        selected_answer = interaction["selected_answer"]
        correct_answer = interaction["correct_answer"]
        attempt_no = interaction.get("attempt_no", 1)
        time_taken_seconds = interaction.get("time_taken_seconds", 0)
        hint_used = interaction.get("hint_used", False)
        misconception_tag = interaction.get("misconception_tag", "unknown")

        is_correct = selected_answer == correct_answer
        mastery_probability = self.bkt_model.update(student_id, concept, is_correct)
        m_label = mastery_label(mastery_probability)
        t_status = get_time_status(time_taken_seconds, current_difficulty)
        a_bucket = get_attempt_bucket(attempt_no)

        is_stuck = (
            (not is_correct and attempt_no >= 2)
            or t_status == "slow"
            or hint_used
            or mastery_probability < 0.35
        )

        # Difficulty RL
        state = (concept, m_label, current_difficulty,
                 answer_status(is_correct), t_status, a_bucket)
        difficulty_action = self.rl_agent.choose_action(state)
        recommended_next_difficulty = difficulty_action_to_label(difficulty_action)
        reward = calculate_difficulty_reward(is_correct, is_stuck, m_label, difficulty_action)
        next_state = (concept, m_label, recommended_next_difficulty,
                      answer_status(is_correct), "normal", "attempt_1")
        self.rl_agent.update(state, difficulty_action, reward, next_state)

        # Support RL
        recommended_support_action = "continue_next_question"
        if is_stuck:
            support_state = (
                concept, m_label, recommended_next_difficulty,
                t_status, a_bucket, misconception_tag
            )
            recommended_support_action = self.support_agent.choose_action(support_state)

        return {
            "student_id": student_id,
            "concept": concept,
            "is_correct": is_correct,
            "bkt_mastery_probability": round(mastery_probability, 4),
            "mastery_level": m_label,
            "is_stuck": is_stuck,
            "recommended_next_difficulty": recommended_next_difficulty,
            "recommended_support_action": recommended_support_action,
        }