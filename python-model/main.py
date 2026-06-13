from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models.bkt_model import BKTModel
from models.ql_agent import QLearningAgent
from models.difficulty_analyzer import (
    DifficultyAnalysisWithBKTRL,
    DIFFICULTY_ACTIONS,
    SUPPORT_ACTIONS,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate models (in-memory, lives as long as server is running)
bkt = BKTModel()
difficulty_rl = QLearningAgent(DIFFICULTY_ACTIONS)
support_rl = QLearningAgent(SUPPORT_ACTIONS)
analyzer = DifficultyAnalysisWithBKTRL(bkt, difficulty_rl, support_rl)


class InteractionPayload(BaseModel):
    student_id: str
    question_id: str
    concept: str
    difficulty: str
    selected_answer: str
    correct_answer: str
    attempt_no: int
    time_taken_seconds: int
    hint_used: bool
    misconception_tag: str = "unknown"


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
def analyze(payload: InteractionPayload):
    result = analyzer.analyze(payload.dict())
    return result