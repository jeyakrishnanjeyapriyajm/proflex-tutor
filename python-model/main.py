from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, List, Optional

from models.bkt_model import BKTModel
from models.ql_agent import QLearningAgent
from models.difficulty_analyzer import (
    DifficultyAnalysisWithBKTRL,
    SUPPORT_ACTIONS,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

bkt = BKTModel()
support_rl = QLearningAgent(SUPPORT_ACTIONS)

analyzer = DifficultyAnalysisWithBKTRL(
    bkt_model=bkt,
    support_rl_agent=support_rl,
)


class InteractionPayload(BaseModel):
    student_id: str
    question_id: str
    module_id: Optional[str] = ""

    concept: str

    selected_answer: str
    correct_answer: str
    attempt_no: int
    time_taken_seconds: int
    hint_used: bool = False
    misconception_tag: str = "unknown"

    difficulty: str

    lecturer_difficulty: Optional[str] = None
    dynamic_difficulty: Optional[str] = None
    effective_difficulty: Optional[str] = None

    question_difficulty_score: float = 0.0
    question_correct_rate: float = 0.0
    question_attempt_count: int = 0
    question_difficulty_source: str = "lecturer"

    student_previous_concept_attempts: int = 0
    student_previous_concept_wrong_rate: float = 0.0
    student_previous_concept_stuck_count: int = 0
    student_previous_hint_rate: float = 0.0
    student_previous_average_time: float = 0.0

    previous_mastery_probability: Optional[float] = None


class RewardPayload(BaseModel):
    q_state: List[Any]
    q_action: str
    reward: float
    next_state: Optional[List[Any]] = None


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
def analyze(payload: InteractionPayload):
    result = analyzer.analyze(payload.dict())
    return result


@app.post("/reward")
def reward(payload: RewardPayload):
    result = analyzer.update_reward(
        q_state=payload.q_state,
        q_action=payload.q_action,
        reward=payload.reward,
        next_state=payload.next_state,
    )

    return result