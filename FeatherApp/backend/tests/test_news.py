from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_symbol_news():
    """Test getting news for a specific symbol"""
    response = client.get("/api/tickers/AAPL/news?limit=5")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "symbol" in data
    assert "items" in data
    assert data["symbol"] == "AAPL"
    assert len(data["items"]) <= 5
    
    if data["items"]:
        item = data["items"][0]
        assert "id" in item
        assert "headline" in item
        assert "publishedAt" in item
        assert "url" in item
        assert "sentiment" in item
        assert "sentimentScore" in item
        assert item["sentiment"] in ["Positive", "Negative", "Neutral"]

def test_get_global_news():
    """Test getting global news feed"""
    response = client.get("/api/news?limit=10")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "items" in data
    assert len(data["items"]) <= 10
    
    if data["items"]:
        item = data["items"][0]
        assert "id" in item
        assert "headline" in item
        assert "publishedAt" in item
        assert "url" in item
        assert "sentiment" in item
        assert "sentimentScore" in item

def test_get_global_news_with_symbol_filter():
    """Test getting global news with symbol filter"""
    response = client.get("/api/news?limit=5&symbol=NVDA")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "symbol" in data
    assert "items" in data
    assert data["symbol"] == "NVDA"
    assert len(data["items"]) <= 5

def test_get_news_limit_validation():
    """Test news limit validation"""
    # Test with limit too high
    response = client.get("/api/news?limit=200")
    assert response.status_code == 422  # Validation error
    
    # Test with limit too low
    response = client.get("/api/news?limit=0")
    assert response.status_code == 422  # Validation error

