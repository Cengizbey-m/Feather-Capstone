from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

class NewsService:
    """Mock news service with deterministic results"""
    
    def __init__(self):
        # Pool of mock news headlines
        self.news_pool = [
            "Company beats earnings expectations with strong Q4 results",
            "Stock surges on positive analyst upgrade and market optimism",
            "Revenue growth exceeds forecasts despite market volatility",
            "New product launch drives investor confidence higher",
            "Partnership announcement boosts market sentiment",
            "Company misses earnings targets amid economic uncertainty",
            "Stock drops on disappointing quarterly results",
            "Revenue decline raises concerns about future growth",
            "Market volatility impacts trading volumes significantly",
            "Regulatory concerns weigh on investor sentiment",
            "Company maintains steady performance in challenging market",
            "Mixed signals from latest financial reports",
            "Trading volume remains stable despite market fluctuations",
            "Analysts maintain neutral outlook on company prospects",
            "Market shows resilience in face of economic headwinds"
        ]
        
        self.symbols = ["AAPL", "NVDA", "TSLA", "MSFT", "GOOGL", "AMZN", "META", "NFLX"]
    
    def get_news(self, symbol: Optional[str] = None, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Get mock news items, optionally filtered by symbol
        """
        # Filter headlines based on symbol if provided
        if symbol:
            # Use symbol to create deterministic filtering
            symbol_seed = hash(symbol) % len(self.news_pool)
            filtered_headlines = self.news_pool[symbol_seed:symbol_seed + limit]
        else:
            filtered_headlines = self.news_pool[:limit]
        
        news_items = []
        base_time = datetime.utcnow()
        
        for i, headline in enumerate(filtered_headlines):
            # Create deterministic news item
            item_id = f"n_{hash(headline) % 10000}"
            published_at = base_time - timedelta(hours=i * 2)
            
            news_items.append({
                "id": item_id,
                "headline": headline,
                "publishedAt": published_at,
                "url": f"https://example.com/news/{item_id}",
                "sentiment": "Positive" if i % 3 == 0 else "Neutral" if i % 3 == 1 else "Negative",
                "sentimentScore": round(0.3 + (i % 7) * 0.1, 2)
            })
        
        return news_items[:limit]
    
    def get_symbol_news(self, symbol: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Get news specifically for a symbol"""
        return self.get_news(symbol=symbol, limit=limit)
    
    # TODO: Replace with real news API integration
    def _get_real_news(self, symbol: str, limit: int) -> List[Dict[str, Any]]:
        """
        Placeholder for real news API integration
        This would integrate with news APIs like NewsAPI, Alpha Vantage, etc.
        """
        pass

