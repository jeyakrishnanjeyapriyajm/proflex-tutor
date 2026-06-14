from collections import defaultdict


class BKTModel:
    """
    Bayesian Knowledge Tracing model.

    Purpose:
    - Estimates student mastery for each concept.
    - Uses correct / wrong answer only.
    - This is the knowledge tracing part of the model.
    """

    def __init__(self, p_l0=0.30, p_t=0.12, p_g=0.20, p_s=0.10):
        # Initial probability that the student already knows the concept
        self.p_l0 = p_l0

        # Probability that the student learns after an attempt
        self.p_t = p_t

        # Guess probability: student gets correct even without mastery
        self.p_g = p_g

        # Slip probability: student gets wrong even with mastery
        self.p_s = p_s

        # mastery[student_id][concept] = mastery probability
        self.mastery = defaultdict(lambda: defaultdict(lambda: self.p_l0))

    def update(self, student_id, concept, is_correct):
        prior = self.mastery[student_id][concept]

        if is_correct:
            numerator = prior * (1 - self.p_s)
            denominator = numerator + (1 - prior) * self.p_g
        else:
            numerator = prior * self.p_s
            denominator = numerator + (1 - prior) * (1 - self.p_g)

        posterior = numerator / denominator if denominator else prior

        # Learning transition
        next_mastery = posterior + (1 - posterior) * self.p_t

        self.mastery[student_id][concept] = max(0.0, min(1.0, next_mastery))

        return self.mastery[student_id][concept]

    def get_mastery(self, student_id, concept):
        return self.mastery[student_id][concept]