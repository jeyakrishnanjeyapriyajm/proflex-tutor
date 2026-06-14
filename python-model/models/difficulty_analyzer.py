from collections import defaultdict


SUPPORT_ACTIONS = [
    "simple_hint",
    "detailed_hint",
    "explanation",
    "worked_example",
    "easier_task",
    "similar_task",
    "harder_challenge",
    "revision_note",
    "code_tracing_steps",
    "retry_same_question",
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
    No skip logic is used.
    """

    if is_correct:
        return False, "not_stuck"

    if attempt_no >= 2:
        return True, "multiple_wrong_attempts"

    if time_status == "slow":
        return True, "slow_response_time"

    if hint_used:
        return True, "hint_requested"

    if final_mastery_probability < 0.35:
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

    if action == "easier_task":
        return "easy"

    if action == "similar_task":
        return current_difficulty

    if action == "harder_challenge":
        return "hard"

    if action in [
        "simple_hint",
        "detailed_hint",
        "explanation",
        "worked_example",
        "revision_note",
        "code_tracing_steps",
        "retry_same_question",
    ]:
        return current_difficulty

    if mastery_level == "low":
        return "easy"

    if mastery_level == "medium":
        return "medium"

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
    Initial reward explanation.
    Real Q-learning reward should be updated after the student uses the support.
    """

    reward = 0

    if is_correct:
        reward += 5
    else:
        reward -= 2

    if is_stuck:
        reward -= 3

    if mastery_level == "low" and action in [
        "worked_example",
        "easier_task",
        "code_tracing_steps",
        "explanation",
    ]:
        reward += 4

    if mastery_level == "medium" and action in [
        "detailed_hint",
        "similar_task",
        "explanation",
    ]:
        reward += 3

    if mastery_level == "high" and action in [
        "retry_same_question",
        "harder_challenge",
        "similar_task",
    ]:
        reward += 3

    if mastery_level == "low" and action == "harder_challenge":
        reward -= 6

    if effective_question_difficulty == "hard" and mastery_level == "low":
        if action in ["worked_example", "easier_task", "code_tracing_steps"]:
            reward += 3

        if action == "retry_same_question":
            reward -= 3

    if previous_wrong_rate >= 0.65 and action in [
        "worked_example",
        "easier_task",
        "explanation",
    ]:
        reward += 2

    if previous_stuck_count >= 2 and action in [
        "revision_note",
        "worked_example",
        "code_tracing_steps",
    ]:
        reward += 2

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

        if not is_stuck:
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
                "is_stuck": False,
                "stuck_reason": stuck_reason,
                "recommended_support_action": "retry_same_question",
                "recommended_next_difficulty": effective_question_difficulty,
                "state": base_state,
                "q_state": [],
                "q_action": "retry_same_question",
                "reward": 0,
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

        recommended_next_difficulty = recovery_difficulty_from_action(
            support_action,
            effective_question_difficulty,
            mastery_level_value,
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
            "is_stuck": True,
            "stuck_reason": stuck_reason,
            "recommended_support_action": support_action,
            "recommended_next_difficulty": recommended_next_difficulty,
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