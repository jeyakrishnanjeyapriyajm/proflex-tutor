import os
import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List, Optional

print("Starting application...")

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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ROOT ROUTE
# =========================

@app.get("/")
def root():
    return {
        "message": "Adaptive Tutor Python Model Running"
    }


# =========================
# HEALTH ROUTE
# =========================

@app.get("/health")
def health():
    return {
        "status": "ok",
        "message": "Python AI model service is running"
    }


# =========================
# LOAD MODELS
# =========================

try:
    print("Loading BKT Model...")
    bkt = BKTModel()

    print("Loading Q-Learning Agent...")
    support_rl = QLearningAgent(SUPPORT_ACTIONS)

    print("Loading Difficulty Analyzer...")
    analyzer = DifficultyAnalysisWithBKTRL(
        bkt_model=bkt,
        support_rl_agent=support_rl,
    )

    print("All models loaded successfully.")

except Exception as e:
    print("STARTUP ERROR:")
    print(str(e))
    raise e


# =========================
# REQUEST MODELS
# =========================

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

    available_recovery_counts: Optional[Dict[str, int]] = None


class RewardPayload(BaseModel):
    q_state: List[Any]
    q_action: str
    reward: float
    next_state: Optional[List[Any]] = None


# =========================
# ANALYZE ENDPOINT
# =========================

@app.post("/analyze")
def analyze(payload: InteractionPayload):
    try:
        result = analyzer.analyze(payload.dict())
        return result

    except Exception as e:
        print("ANALYZE ERROR:", str(e))
        raise e


# =========================
# REWARD ENDPOINT
# =========================

@app.post("/reward")
def reward(payload: RewardPayload):
    try:
        result = analyzer.update_reward(
            q_state=payload.q_state,
            q_action=payload.q_action,
            reward=payload.reward,
            next_state=payload.next_state,
        )

        return result

    except Exception as e:
        print("REWARD ERROR:", str(e))
        raise e


# =========================
# LOCAL / MANUAL RUN
# =========================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port
    )
