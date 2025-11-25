from pydantic import BaseModel
from typing import List, Literal
from datetime import datetime

class AlertRule(BaseModel):
    metric: str
    op: Literal["<=", ">=", "<", ">", "==", "!="]
    value: float

class AlertCreate(BaseModel):
    symbol: str
    rule: AlertRule

class Alert(BaseModel):
    id: int
    symbol: str
    rule: AlertRule
    is_active: Literal["active", "triggered", "disabled"]
    created_at: datetime
    triggered_at: datetime | None = None
    
    class Config:
        from_attributes = True

class AlertResponse(BaseModel):
    items: List[Alert]

