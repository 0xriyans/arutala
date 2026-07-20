from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from app.db.session import get_session
from app.models.quiz import QuizLog, QuizSubmit
from app.api.routes.auth import get_current_admin

router = APIRouter()

@router.post("/", response_model=QuizLog)
def submit_quiz(data: QuizSubmit, session: Session = Depends(get_session)):
    quiz = QuizLog(
        answers=data.answers, 
        recommendedProductSlug=data.recommendedProductSlug
    )
    session.add(quiz)
    session.commit()
    session.refresh(quiz)
    return quiz

@router.get("/", response_model=List[QuizLog])
def get_quizzes(session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    return session.exec(select(QuizLog).order_by(QuizLog.date.desc())).all()

@router.delete("/{quiz_id}")
def delete_quiz(quiz_id: str, session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    quiz = session.exec(select(QuizLog).where(QuizLog.id == quiz_id)).first()
    if quiz:
        session.delete(quiz)
        session.commit()
    return {"message": "Deleted"}

@router.delete("/")
def clear_quizzes(session: Session = Depends(get_session), admin = Depends(get_current_admin)):
    quizzes = session.exec(select(QuizLog)).all()
    for q in quizzes:
        session.delete(q)
    session.commit()
    return {"message": "Cleared"}
