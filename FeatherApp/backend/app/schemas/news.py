from pydantic import BaseModel
from typing import List, Literal, Optional
from datetime import datetime

class NewsItem(BaseModel):
    id: str
    headline: str
    publishedAt: datetime
    url: str
    sentiment: Literal["Positive", "Negative", "Neutral"]
    sentimentScore: float

class NewsResponse(BaseModel):
    symbol: Optional[str] = None
    items: List[NewsItem]

