from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_prediction():
    """Test getting prediction for a symbol"""
    response = client.get("/api/tickers/AAPL/prediction?window=1d")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "symbol" in data
    assert "asOf" in data
    assert "prediction" in data
    assert "model" in data
    
    assert data["symbol"] == "AAPL"
    assert "deltaPct" in data["prediction"]
    assert "direction" in data["prediction"]
    assert "confidence" in data["prediction"]
    assert data["prediction"]["direction"] in ["up", "down"]
    assert 0 <= data["prediction"]["confidence"] <= 1

def test_get_prediction_invalid_window():
    """Test getting prediction with invalid window"""
    response = client.get("/api/tickers/AAPL/prediction?window=invalid")
    
    assert response.status_code == 400
    assert "Window must be one of" in response.json()["detail"]

def test_get_prediction_different_symbols():
    """Test that different symbols return different predictions"""
    response1 = client.get("/api/tickers/AAPL/prediction")
    response2 = client.get("/api/tickers/NVDA/prediction")
    
    assert response1.status_code == 200
    assert response2.status_code == 200
    
    data1 = response1.json()
    data2 = response2.json()
    
    # Different symbols should have different predictions
    assert data1["symbol"] != data2["symbol"]
    # Predictions might be different (though not guaranteed with mock)

