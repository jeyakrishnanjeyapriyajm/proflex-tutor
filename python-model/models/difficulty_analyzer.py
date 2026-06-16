from collections import defaultdict


SUPPORT_ACTIONS = [
    "simple_hint",
    "explanation",
    "easier_task",
    "similar_task",
    "harder_challenge",
    "retry_same_question"
]


EXPECTED_TIME = {
    "easy": 45,
    "medium": 90,
    "hard": 150,
}


def safe_float(value, default=0.0):
    try:
        return float(value)
    except Exception:
        return default


def safe_int(value, default=0):
    try:
        return int(value)
    except Exception:
        return default


def clamp01(value):
    value = safe_float(value)
    return max(0.0, min(1.0, value))


def normalize_difficulty(value, fallback="medium"):
    if not value:
        return fallback

    value = str(value).lower()

    if value in ["easy", "medium", "hard"]:
        return value

    return fallback


def mastery_label(probability):
    probability = safe_float(probability)

    if probability < 0.40:
        return "low"

    if probability < 0.70:
        return "medium"

    return "high"


def difficulty_score_label(score):
    score = safe_float(score)

    if score < 0.35:
        return "low_question_difficulty"

    if score < 0.65:
        return "medium_question_difficulty"

    return "high_question_difficulty"


def previous_wrong_rate_label(rate):
    rate = safe_float(rate)

    if rate < 0.35:
        return "low_previous_wrong_rate"

    if rate < 0.65:
        return "medium_previous_wrong_rate"

    return "high_previous_wrong_rate"


def previous_stuck_label(count):
    count = safe_int(count)

    if count <= 0:
        return "no_previous_stuck"

    if count <= 2:
        return "some_previous_stuck"

    return "frequent_previous_stuck"


def get_time_status(seconds, difficulty):
    difficulty = normalize_difficulty(difficulty)
    expected = EXPECTED_TIME.get(difficulty, 90)

    if safe_float(seconds) > expected:
        return "slow"

    return "normal"


def decide_recovery_count_from_agent_state(
    support_action,
    mastery_level,
    attempt_no,
    previous_wrong_rate,
    previous_stuck_count,
    time_status,
    available_count,
):
    """
    Q-agent recovery count decision.

    The backend must not decide the count for explanation/easier/similar.
    The AI model returns the count, then the backend only caps it by MongoDB
    availability and removes already-used recovery questions.

    Required action ranges:
    - explanation: 1 to 3 recovery questions
    - easier_task: 2 to 5 recovery questions
    - similar_task: 1 to 2 recovery questions
    - harder_challenge: exactly 1 recovery question
    - simple_hint / retry_same_question: 0 recovery questions
    """

    available_count = safe_int(available_count, 0)

    if available_count <= 0:
        return 0

    if support_action in ["simple_hint", "retry_same_question"]:
        return 0

    if support_action == "harder_challenge":
        return min(1, available_count)

    risk_score = 0

    if mastery_level == "low":
        risk_score += 2
    elif mastery_level == "medium":
        risk_score += 1

    if safe_int(attempt_no) >= 3:
        risk_score += 1

    if safe_float(previous_wrong_rate) >= 0.65:
        risk_score += 1

    if safe_int(previous_stuck_count) >= 2:
        risk_score += 1

    if time_status == "slow":
        risk_score += 1

    if support_action == "explanation":
        # Agent decides inside 1-3 range.
        if risk_score >= 4:
            count = 3
        elif risk_score >= 2:
            count = 2
        else:
            count = 1
        return min(count, available_count)

    if support_action == "easier_task":
        # Agent decides inside 2-5 range.
        count = 2 + min(3, risk_score)
        return min(count, available_count)

    if support_action == "similar_task":
        # Agent decides inside 1-2 range.
        count = 2 if risk_score >= 2 else 1
        return min(count, available_count)

    return 0


def should_block_question_from_action(support_action):
    """
    Current main question is never blocked in the new flow.

    The student returns to the same main question after:
    - simple hint
    - explanation recovery success
    - easier/similar recovery success
    - 5-minute concept review

    Only harder_challenge success can skip to the next main question.
    Recovery repetition is controlled by usedRecoveryQuestionIds in the backend.
    """

    return False


def get_attempt_bucket(attempt_no):
    attempt_no = safe_int(attempt_no, 1)

    if attempt_no >= 3:
        return "attempt_3_plus"

    if attempt_no == 2:
        return "attempt_2"

    return "attempt_1"


def get_effective_question_difficulty(interaction):
    """
    Choose which question difficulty the model should trust.

    Priority:
    1. effective_difficulty from Node.js
    2. dynamic_difficulty if enough previous students attempted
    3. lecturer/admin difficulty
    4. original difficulty field
    """

    effective = interaction.get("effective_difficulty")
    dynamic = interaction.get("dynamic_difficulty")
    lecturer = interaction.get("lecturer_difficulty")
    original = interaction.get("difficulty")

    question_attempt_count = safe_int(
        interaction.get("question_attempt_count", 0)
    )

    if effective in ["easy", "medium", "hard"]:
        return effective

    if question_attempt_count >= 20 and dynamic in ["easy", "medium", "hard"]:
        return dynamic

    if lecturer in ["easy", "medium", "hard"]:
        return lecturer

    return normalize_difficulty(original, "medium")


class BehaviorKnowledgeTracker:
    """
    Behavior-based knowledge tracker.

    This is inside difficulty_analyzer.py as you requested.

    It updates concept mastery using:
    - correctness
    - attempt count
    - response time
    - hint usage
    - previous wrong rate
    - previous stuck count

    No skip logic is used.
    """

    def __init__(self, initial_mastery=0.30):
        self.initial_mastery = initial_mastery
        self.mastery = defaultdict(lambda: defaultdict(lambda: self.initial_mastery))

    def update(
        self,
        student_id,
        concept,
        is_correct,
        attempt_no,
        time_status,
        hint_used,
        previous_wrong_rate=0.0,
        previous_stuck_count=0,
    ):
        current_mastery = self.mastery[student_id][concept]
        change = 0.0

        if is_correct:
            if attempt_no == 1 and not hint_used and time_status == "normal":
                change += 0.10
            elif attempt_no == 1 and hint_used:
                change += 0.05
            elif attempt_no >= 2 and not hint_used:
                change += 0.06
            else:
                change += 0.04
        else:
            change -= 0.04

        if attempt_no == 2:
            change -= 0.02

        if attempt_no >= 3:
            change -= 0.04

        if time_status == "slow":
            change -= 0.02

        if hint_used and not is_correct:
            change -= 0.02

        if previous_wrong_rate >= 0.65:
            change -= 0.03

        if previous_stuck_count >= 2:
            change -= 0.03

        new_mastery = clamp01(current_mastery + change)

        self.mastery[student_id][concept] = new_mastery

        return new_mastery

    def get_mastery(self, student_id, concept):
        return self.mastery[student_id][concept]


def combine_mastery(bkt_mastery, behavior_mastery, previous_mastery=None):
    """
    Final mastery combines:
    - BKT mastery
    - behavior mastery
    - previous DB mastery if available
    """

    bkt_mastery = safe_float(bkt_mastery)
    behavior_mastery = safe_float(behavior_mastery)

    if previous_mastery is None:
        return clamp01((bkt_mastery * 0.65) + (behavior_mastery * 0.35))

    previous_mastery = safe_float(previous_mastery)

    return clamp01(
        (bkt_mastery * 0.60)
        + (behavior_mastery * 0.30)
        + (previous_mastery * 0.10)
    )


def detect_stuck(
    is_correct,
    attempt_no,
    time_status,
    hint_used,
    final_mastery_probability,
    student_previous_concept_wrong_rate,
    student_previous_concept_stuck_count,
    question_difficulty_score,
):
    """
    Behavior-based stuck detection.

    Important rule:
    - A first wrong answer with normal time and no hint is NOT stuck.
    - Q-learning starts only after the student is stuck.
    """

    if is_correct:
        return False, "not_stuck"

    if attempt_no >= 2:
        return True, "multiple_wrong_attempts"

    if time_status == "slow":
        return True, "slow_response_time"

    if hint_used:
        return True, "hint_requested"

    # First normal wrong answer should retry the same question without support.
    if attempt_no >= 2 and final_mastery_probability < 0.35:
        return True, "low_mastery"

    if student_previous_concept_wrong_rate >= 0.65:
        return True, "high_previous_wrong_rate"

    if student_previous_concept_stuck_count >= 2:
        return True, "frequent_previous_stuck"

    if question_difficulty_score >= 0.75 and final_mastery_probability < 0.50:
        return True, "hard_question_low_mastery"

    return False, "not_stuck"


def recovery_difficulty_from_action(action, current_difficulty, mastery_level):
    current_difficulty = normalize_difficulty(current_difficulty)

    if action == "explanation":
        # Explanation recovery stays at the same difficulty.
        return current_difficulty

    if action == "easier_task":
        # Easier recovery moves one level down when possible.
        if current_difficulty == "hard":
            return "medium"
        return "easy"

    if action == "similar_task":
        # Similar recovery uses the same difficulty.
        return current_difficulty

    if action == "harder_challenge":
        # Harder challenge is allowed only for high mastery by ql_agent.py.
        if current_difficulty == "easy":
            return "medium"
        return "hard"

    return current_difficulty


def calculate_support_reward_seed(
    is_correct,
    is_stuck,
    mastery_level,
    action,
    effective_question_difficulty,
    previous_wrong_rate,
    previous_stuck_count,
):
    """
    Initial reward seed.

    This is not the final reward.
    Final Q-learning reward should come after the student uses the support.
    """

    reward = 0

    if is_correct:
        reward += 5
    else:
        reward -= 2

    if is_stuck:
        reward -= 3

    # Low mastery students need stronger help.
    if mastery_level == "low":
        if action == "easier_task":
            reward += 5

        elif action == "explanation":
            reward += 4

        elif action == "simple_hint":
            reward += 2

        elif action == "harder_challenge":
            reward -= 8

        elif action == "retry_same_question":
            reward -= 3

    # Medium mastery students can use hint, explanation, or similar task.
    elif mastery_level == "medium":
        if action == "similar_task":
            reward += 4

        elif action == "explanation":
            reward += 3

        elif action == "simple_hint":
            reward += 2

        elif action == "easier_task":
            reward += 1

        elif action == "harder_challenge":
            reward -= 2

    # High mastery students should not always receive hints.
    elif mastery_level == "high":
        if action == "harder_challenge":
            reward += 5

        elif action == "similar_task":
            reward += 4

        elif action == "retry_same_question":
            reward += 3

        elif action == "simple_hint":
            reward -= 1

        elif action == "explanation":
            reward -= 1

    # If the question itself is hard and the student has low mastery,
    # easier_task or explanation is safer than retrying blindly.
    if effective_question_difficulty == "hard" and mastery_level == "low":
        if action in ["easier_task", "explanation"]:
            reward += 3

        if action == "retry_same_question":
            reward -= 3

    # Previous poor performance means the learner needs stronger support.
    if previous_wrong_rate >= 0.65:
        if action in ["easier_task", "explanation"]:
            reward += 2

        if action == "simple_hint":
            reward -= 1

    if previous_stuck_count >= 2:
        if action in ["easier_task", "explanation"]:
            reward += 2

        if action == "simple_hint":
            reward -= 1

    return reward


class DifficultyAnalysisWithBKTRL:
    """
    Main connector model.

    It connects:
    1. Question difficulty analysis
    2. BKT mastery
    3. Behavior-based mastery
    4. Stuck detection
    5. Q-learning support decision
    """

    def __init__(self, bkt_model, support_rl_agent):
        self.bkt_model = bkt_model
        self.behavior_tracker = BehaviorKnowledgeTracker()
        self.support_agent = support_rl_agent

    def analyze(self, interaction):
        student_id = interaction["student_id"]
        question_id = interaction["question_id"]
        module_id = interaction.get("module_id", "")

        concept = interaction["concept"]

        selected_answer = interaction["selected_answer"]
        correct_answer = interaction["correct_answer"]

        attempt_no = safe_int(interaction.get("attempt_no", 1), 1)
        time_taken_seconds = safe_int(interaction.get("time_taken_seconds", 0), 0)
        hint_used = bool(interaction.get("hint_used", False))
        misconception_tag = interaction.get("misconception_tag", "unknown")

        lecturer_difficulty = normalize_difficulty(
            interaction.get("lecturer_difficulty"),
            normalize_difficulty(interaction.get("difficulty"), "medium"),
        )

        dynamic_difficulty = interaction.get("dynamic_difficulty", "not_enough_data")

        effective_question_difficulty = get_effective_question_difficulty(interaction)

        question_difficulty_score = safe_float(
            interaction.get("question_difficulty_score", 0.0)
        )

        question_correct_rate = safe_float(
            interaction.get("question_correct_rate", 0.0)
        )

        question_attempt_count = safe_int(
            interaction.get("question_attempt_count", 0)
        )

        question_difficulty_source = interaction.get(
            "question_difficulty_source",
            "lecturer",
        )

        student_previous_concept_attempts = safe_int(
            interaction.get("student_previous_concept_attempts", 0)
        )

        student_previous_concept_wrong_rate = safe_float(
            interaction.get("student_previous_concept_wrong_rate", 0.0)
        )

        student_previous_concept_stuck_count = safe_int(
            interaction.get("student_previous_concept_stuck_count", 0)
        )

        student_previous_hint_rate = safe_float(
            interaction.get("student_previous_hint_rate", 0.0)
        )

        student_previous_average_time = safe_float(
            interaction.get("student_previous_average_time", 0.0)
        )

        previous_mastery_probability = interaction.get(
            "previous_mastery_probability"
        )

        is_correct = selected_answer == correct_answer

        time_status = get_time_status(
            time_taken_seconds,
            effective_question_difficulty,
        )

        attempt_bucket = get_attempt_bucket(attempt_no)

        bkt_mastery_probability = self.bkt_model.update(
            student_id,
            concept,
            is_correct,
        )

        behavior_mastery_probability = self.behavior_tracker.update(
            student_id=student_id,
            concept=concept,
            is_correct=is_correct,
            attempt_no=attempt_no,
            time_status=time_status,
            hint_used=hint_used,
            previous_wrong_rate=student_previous_concept_wrong_rate,
            previous_stuck_count=student_previous_concept_stuck_count,
        )

        final_mastery_probability = combine_mastery(
            bkt_mastery=bkt_mastery_probability,
            behavior_mastery=behavior_mastery_probability,
            previous_mastery=previous_mastery_probability,
        )

        mastery_level_value = mastery_label(final_mastery_probability)

        is_stuck, stuck_reason = detect_stuck(
            is_correct=is_correct,
            attempt_no=attempt_no,
            time_status=time_status,
            hint_used=hint_used,
            final_mastery_probability=final_mastery_probability,
            student_previous_concept_wrong_rate=student_previous_concept_wrong_rate,
            student_previous_concept_stuck_count=student_previous_concept_stuck_count,
            question_difficulty_score=question_difficulty_score,
        )

        question_difficulty_band = difficulty_score_label(question_difficulty_score)

        previous_wrong_band = previous_wrong_rate_label(
            student_previous_concept_wrong_rate
        )

        previous_stuck_band = previous_stuck_label(
            student_previous_concept_stuck_count
        )

        base_state = {
            "module_id": module_id,
            "concept": concept,
            "lecturer_difficulty": lecturer_difficulty,
            "dynamic_difficulty": dynamic_difficulty,
            "effective_question_difficulty": effective_question_difficulty,
            "question_difficulty_score": round(question_difficulty_score, 4),
            "question_difficulty_band": question_difficulty_band,
            "question_correct_rate": round(question_correct_rate, 4),
            "question_attempt_count": question_attempt_count,
            "question_difficulty_source": question_difficulty_source,
            "bkt_mastery_probability": round(bkt_mastery_probability, 4),
            "behavior_mastery_probability": round(
                behavior_mastery_probability,
                4,
            ),
            "final_mastery_probability": round(final_mastery_probability, 4),
            "mastery_level": mastery_level_value,
            "attempt_bucket": attempt_bucket,
            "time_status": time_status,
            "hint_used": hint_used,
            "misconception_tag": misconception_tag,
            "previous_concept_attempts": student_previous_concept_attempts,
            "previous_wrong_rate": round(student_previous_concept_wrong_rate, 4),
            "previous_wrong_band": previous_wrong_band,
            "previous_stuck_count": student_previous_concept_stuck_count,
            "previous_stuck_band": previous_stuck_band,
            "previous_hint_rate": round(student_previous_hint_rate, 4),
            "previous_average_time": round(student_previous_average_time, 2),
            "stuck_reason": stuck_reason,
        }

        # Correct answer:
        # Do not ask the Q-agent for support.
        # Backend should continue the stored main question sequence.
        if is_correct:
            return {
                "student_id": student_id,
                "question_id": question_id,
                "module_id": module_id,
                "concept": concept,
                "is_correct": True,
                "bkt_mastery_probability": round(bkt_mastery_probability, 4),
                "behavior_mastery_probability": round(
                    behavior_mastery_probability,
                    4,
                ),
                "final_mastery_probability": round(final_mastery_probability, 4),
                "mastery_level": mastery_level_value,
                "is_stuck": False,
                "stuck_reason": "not_stuck",
                "recommended_support_action": "continue_main_sequence",
                "recommended_next_difficulty": effective_question_difficulty,
                "recommended_recovery_count": 0,
                "should_block_current_question": False,
                "post_recovery_decision": "continue_main_sequence",
                "available_recovery_counts": {},
                "available_count_for_difficulty": 0,
                "state": base_state,
                "q_state": [],
                "q_action": "continue_main_sequence",
                "reward": 5,
            }

        q_state = (
            module_id,
            concept,
            effective_question_difficulty,
            question_difficulty_band,
            mastery_level_value,
            attempt_bucket,
            time_status,
            str(hint_used),
            misconception_tag,
            previous_wrong_band,
            previous_stuck_band,
        )

        support_action = self.support_agent.choose_action(q_state)

        if support_action not in SUPPORT_ACTIONS:
            support_action = "simple_hint"

        recommended_next_difficulty = recovery_difficulty_from_action(
            support_action,
            effective_question_difficulty,
            mastery_level_value,
        )

        available_recovery_counts = interaction.get("available_recovery_counts", {})

        if not isinstance(available_recovery_counts, dict):
            available_recovery_counts = {}

        available_count_for_difficulty = safe_int(
            available_recovery_counts.get(recommended_next_difficulty, 0),
            0,
        )

        recommended_recovery_count = decide_recovery_count_from_agent_state(
            support_action=support_action,
            mastery_level=mastery_level_value,
            attempt_no=attempt_no,
            previous_wrong_rate=student_previous_concept_wrong_rate,
            previous_stuck_count=student_previous_concept_stuck_count,
            time_status=time_status,
            available_count=available_count_for_difficulty,
        )

        should_block_current_question = should_block_question_from_action(
            support_action
        )

        reward_seed = calculate_support_reward_seed(
            is_correct=is_correct,
            is_stuck=is_stuck,
            mastery_level=mastery_level_value,
            action=support_action,
            effective_question_difficulty=effective_question_difficulty,
            previous_wrong_rate=student_previous_concept_wrong_rate,
            previous_stuck_count=student_previous_concept_stuck_count,
        )

        return {
            "student_id": student_id,
            "question_id": question_id,
            "module_id": module_id,
            "concept": concept,
            "is_correct": is_correct,
            "bkt_mastery_probability": round(bkt_mastery_probability, 4),
            "behavior_mastery_probability": round(
                behavior_mastery_probability,
                4,
            ),
            "final_mastery_probability": round(final_mastery_probability, 4),
            "mastery_level": mastery_level_value,
            "is_stuck": bool(is_stuck),
            "stuck_reason": stuck_reason,
            "recommended_support_action": support_action,
            "recommended_next_difficulty": recommended_next_difficulty,
            "recommended_recovery_count": recommended_recovery_count,
            "should_block_current_question": should_block_current_question,
            "post_recovery_decision": "ask_q_agent_again",
            "available_recovery_counts": available_recovery_counts,
            "available_count_for_difficulty": available_count_for_difficulty,
            "state": base_state,
            "q_state": list(q_state),
            "q_action": support_action,
            "reward": reward_seed,
        }

    def update_reward(self, q_state, q_action, reward, next_state=None):
        state = tuple(q_state)

        if next_state is None:
            next_state = state
        else:
            next_state = tuple(next_state)

        updated_q = self.support_agent.update(
            state,
            q_action,
            reward,
            next_state,
        )

        return {
            "updated_q_value": updated_q,
            "state": list(state),
            "action": q_action,
            "reward": reward,
            "next_state": list(next_state),
        }