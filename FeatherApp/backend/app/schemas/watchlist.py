from pydantic import BaseModel
from typing import List

class WatchlistItem(BaseModel):
    symbol: str

class WatchlistResponse(BaseModel):
    items: List[str]

class WatchlistCreate(BaseModel):
    symbol: str

