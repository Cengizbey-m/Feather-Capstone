from fastapi import APIRouter, Query, HTTPException, status
from typing import Optional
from app.schemas.news import NewsResponse
from app.services.news_service import NewsService

router = APIRouter()
news_service = NewsService()

@router.get("/tickers/{symbol}/news", response_model=NewsResponse)
async def get_symbol_news(
    symbol: str,
    limit: int = Query(20, ge=1, le=100, description="Maximum number of news items to return")
):
    """Get news for a specific ticker symbol"""
    try:
        symbol = symbol.upper()
        news_items = news_service.get_symbol_news(symbol, limit)
        
        return NewsResponse(symbol=symbol, items=news_items)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching news: {str(e)}"
        )

@router.get("/news", response_model=NewsResponse)
async def get_global_news(
    limit: int = Query(50, ge=1, le=100, description="Maximum number of news items to return"),
    symbol: Optional[str] = Query(None, description="Filter by symbol")
):
    """Get global news feed with optional symbol filter"""
    try:
        if symbol:
            symbol = symbol.upper()
            news_items = news_service.get_symbol_news(symbol, limit)
            return NewsResponse(symbol=symbol, items=news_items)
        else:
            news_items = news_service.get_news(limit=limit)
            return NewsResponse(items=news_items)
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching news: {str(e)}"
        )

