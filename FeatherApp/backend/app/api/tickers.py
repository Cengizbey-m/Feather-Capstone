from fastapi import APIRouter, HTTPException, status, Query
from app.schemas.prediction import PredictionResponse
from app.services.prediction_service import PredictionService

router = APIRouter()
prediction_service = PredictionService()

@router.get("/{symbol}/prediction", response_model=PredictionResponse)
async def get_prediction(
    symbol: str,
    window: str = Query("1d", description="Prediction window")
):
    """Get prediction for a ticker symbol"""
    try:
        # Convert symbol to uppercase for consistency
        symbol = symbol.upper()
        
        # Validate window parameter
        if window not in ["1d", "1w", "1m"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Window must be one of: 1d, 1w, 1m"
            )
        
        prediction = prediction_service.get_prediction(symbol, window)
        return prediction
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating prediction: {str(e)}"
        )

