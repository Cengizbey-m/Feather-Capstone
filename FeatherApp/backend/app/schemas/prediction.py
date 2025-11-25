from pydantic import BaseModel
from typing import Literal
from datetime import datetime

class PredictionModel(BaseModel):
    type: str
    version: str

class Prediction(BaseModel):
    deltaPct: float
    direction: Literal["up", "down"]
    confidence: float

class PredictionResponse(BaseModel):
    symbol: str
    asOf: datetime
    prediction: Prediction
    model: PredictionModel

