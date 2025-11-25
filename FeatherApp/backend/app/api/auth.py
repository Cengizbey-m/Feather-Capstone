from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import UserLogin, Token, User as UserSchema
from app.core.security import verify_password, create_access_token
from app.core.deps import get_current_user
from datetime import timedelta
from app.core.config import settings

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return access token"""
    # For demo purposes, create a default user if none exists
    user = db.query(User).filter(User.email == user_credentials.email).first()
    
    if not user:
        # Create demo user
        from app.core.security import get_password_hash
        user = User(
            email=user_credentials.email,
            hashed_password=get_password_hash(user_credentials.password)
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserSchema.from_orm(user)
    }

@router.get("/me", response_model=UserSchema)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserSchema.from_orm(current_user)

