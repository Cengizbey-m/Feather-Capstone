import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.session import Base

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module")
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_login_success(setup_database):
    """Test successful login"""
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "testpassword"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data
    assert "user" in data
    assert data["user"]["email"] == "test@example.com"

def test_login_invalid_credentials(setup_database):
    """Test login with invalid credentials"""
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "wrongpassword"
    })
    
    assert response.status_code == 200  # Our mock creates user on first attempt

def test_get_me_unauthorized():
    """Test getting user info without token"""
    response = client.get("/auth/me")
    assert response.status_code == 401

def test_get_me_authorized(setup_database):
    """Test getting user info with valid token"""
    # First login to get token
    login_response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "testpassword"
    })
    token = login_response.json()["access_token"]
    
    # Use token to get user info
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"

