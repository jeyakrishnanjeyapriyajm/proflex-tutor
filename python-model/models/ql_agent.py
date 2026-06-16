import random
from collections import defaultdict


class QLearningAgent:
    """
    Q-learning support-action agent.

    Purpose:
    - Used only when the student is stuck.
    - Selects one adaptive support action.
    - Does not control the full quiz order.

    Fix included:
    - Random tie-breaking when Q-values are equal.
    - Action filtering based on mastery level.
    - Prevents simple_hint from always winning at cold start.
    """

    def __init__(self, actions, alpha=0.1, gamma=0.9, epsilon=0.35):
        self.actions = actions
        self.alpha = alpha
        self.gamma = gamma
        self.epsilon = epsilon

        # q_table[state][action] = Q value
        self.q_table = defaultdict(lambda: {a: 0.0 for a in actions})

    def get_allowed_actions(self, state):
        """
        Filter actions based on mastery level.

        New flow:
        - retry_same_question is not a stuck-support action.
        - low/medium mastery cannot receive harder_challenge.
        - harder_challenge is only for high mastery.
        """

        mastery_level = "medium"
        current_difficulty = "medium"

        try:
            current_difficulty = state[2]
            mastery_level = state[4]
        except Exception:
            pass

        if mastery_level == "low":
            return [
                "simple_hint",
                "explanation",
                "easier_task",
            ]

        if mastery_level == "medium":
            return [
                "simple_hint",
                "explanation",
                "easier_task",
                "similar_task",
            ]

        if mastery_level == "high":
            if current_difficulty == "hard":
                return [
                    "similar_task",
                    "simple_hint",
                ]

            return [
                "similar_task",
                "harder_challenge",
                "simple_hint",
            ]

        return [
            "simple_hint",
            "explanation",
            "easier_task",
            "similar_task",
        ]

    def choose_action(self, state):
        """
        Epsilon-greedy action selection with random tie-breaking.

        Why:
        - At the beginning, all Q-values are 0.
        - If we use normal max(), the first action always wins.
        - Random tie-breaking prevents simple_hint from always being selected.
        """

        allowed_actions = self.get_allowed_actions(state)

        # Safety: keep only actions that exist in the Q-table action list.
        allowed_actions = [
            action for action in allowed_actions if action in self.actions
        ]

        if not allowed_actions:
            allowed_actions = list(self.actions)

        # Exploration
        if random.random() < self.epsilon:
            return random.choice(allowed_actions)

        q_values = self.q_table[state]

        max_q = max(q_values[action] for action in allowed_actions)

        best_actions = [
            action
            for action in allowed_actions
            if q_values[action] == max_q
        ]

        return random.choice(best_actions)

    def update(self, state, action, reward, next_state):
        """
        Q-learning update formula:

        Q(s,a) = Q(s,a) + alpha * [reward + gamma * max Q(s',a') - Q(s,a)]
        """

        if action not in self.actions:
            return 0.0

        old_q = self.q_table[state][action]

        next_allowed_actions = self.get_allowed_actions(next_state)
        next_allowed_actions = [
            a for a in next_allowed_actions if a in self.actions
        ]

        if not next_allowed_actions:
            next_allowed_actions = list(self.actions)

        max_next = max(
            self.q_table[next_state][next_action]
            for next_action in next_allowed_actions
        )

        new_q = old_q + self.alpha * (
            reward + self.gamma * max_next - old_q
        )

        self.q_table[state][action] = new_q

        return new_q