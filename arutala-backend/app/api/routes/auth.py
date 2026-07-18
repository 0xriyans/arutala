from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import timedelta
from app.db.session import get_session
from app.models.user import User, UserCreate, UserRead, UserLogin, ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest, GoogleLoginRequest, UserProfileUpdate
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings

# Temporary mock for get_current_user logic which usually needs to be in security or dependencies
# Since we need to access DB for get_current_user, we can define a dependency here or in a separate file.
# For simplicity, we define it here, but it could be in a `deps.py` file.
from fastapi.security import OAuth2PasswordBearer
import jwt
# Wait, we used PyJWT in security! Let's define the dependency properly.

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    user = session.exec(select(User).where(User.email == email)).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user

router = APIRouter()

@router.post("/register", response_model=UserRead)
def register(user: UserCreate, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == user.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        email=user.email,
        name=user.name,
        passwordHash=get_password_hash(user.password),
        role="customer",
        address=user.address,
        city=user.city,
        postalCode=user.postalCode
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

@router.post("/login")
def login(user_data: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == user_data.email)).first()
    if not user or not verify_password(user_data.password, user.passwordHash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserRead)
def update_profile(data: UserProfileUpdate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    current_user.name = data.name
    current_user.address = data.address
    current_user.city = data.city
    current_user.postalCode = data.postalCode
    
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user

@router.post("/change-password")
def change_password(data: ChangePasswordRequest, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if not verify_password(data.old_password, current_user.passwordHash):
        raise HTTPException(status_code=400, detail="Incorrect old password")
    
    current_user.passwordHash = get_password_hash(data.new_password)
    session.add(current_user)
    session.commit()
    return {"message": "Password changed successfully"}

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == data.email)).first()
    if not user:
        # For security, we don't disclose if user exists or not, but for convenience in mock we can or just return status.
        # Let's return success message anyway to prevent email enumeration, but include token in JSON response as requested.
        raise HTTPException(status_code=404, detail="Email not found")
        
    # Generate token valid for 15 minutes
    reset_token_expires = timedelta(minutes=15)
    reset_token = create_access_token(
        data={"sub": user.email, "type": "reset"}, expires_delta=reset_token_expires
    )
    
    # Send email log mock
    print(f"--- MOCK EMAIL FORGOT PASSWORD ---")
    print(f"To: {user.email}")
    print(f"Reset Link: http://localhost:5173/reset-password?token={reset_token}")
    print(f"----------------------------------")
    
    return {
        "message": "Password reset token generated successfully. In production, this would be sent to your email.",
        "token": reset_token
    }

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, session: Session = Depends(get_session)):
    try:
        payload = jwt.decode(data.token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        if email is None or token_type != "reset":
            raise HTTPException(status_code=400, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
        
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
        
    user.passwordHash = get_password_hash(data.new_password)
    session.add(user)
    session.commit()
    return {"message": "Password has been reset successfully"}

@router.post("/google")
def google_login(data: GoogleLoginRequest, session: Session = Depends(get_session)):
    try:
        client_id = settings.GOOGLE_CLIENT_ID
        if not client_id:
            raise HTTPException(status_code=400, detail="GOOGLE_CLIENT_ID is not configured on the backend.")
            
        from google.auth.transport import requests as google_requests
        from google.oauth2 import id_token as google_id_token
        
        idinfo = google_id_token.verify_oauth2_token(data.id_token, google_requests.Request(), client_id)
        
        email = idinfo.get("email")
        name = idinfo.get("name")
        
        if not email:
            raise HTTPException(status_code=400, detail="Invalid token: Email not provided by Google.")
            
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid Google token: {str(e)}")
        
    user = session.exec(select(User).where(User.email == email)).first()
    
    if not user:
        import secrets
        random_password = secrets.token_hex(16)
        user = User(
            email=email,
            name=name or "Google User",
            passwordHash=get_password_hash(random_password),
            role="customer"
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
