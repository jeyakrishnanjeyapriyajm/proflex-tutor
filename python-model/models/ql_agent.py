import random
from collections import defaultdict

class QLearningAgent:
    def __init__(self, actions, alpha=0.1, gamma=0.9, epsilon=0.2):
        self.actions = actions
        self.alpha = alpha
        self.gamma = gamma
        self.epsilon = epsilon
        self.q_table = defaultdict(lambda: {a: 0.0 for a in actions})

    def choose_action(self, state):
        if random.random() < self.epsilon:
            return random.choice(self.actions)
        return max(self.q_table[state], key=self.q_table[state].get)

    def update(self, state, action, reward, next_state):
        old_q = self.q_table[state][action]
        max_next = max(self.q_table[next_state].values())
        new_q = old_q + self.alpha * (reward + self.gamma * max_next - old_q)
        self.q_table[state][action] = new_q
        return new_q