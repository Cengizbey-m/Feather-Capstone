from typing import List, Dict, Any
import hashlib
import random

class SentimentService:
    """Mock sentiment analysis service with deterministic results"""
    
    def __init__(self):
        # Simple keyword-based sentiment mapping
        self.positive_keywords = [
            "beat", "exceed", "growth", "profit", "gain", "rise", "up", "strong",
            "positive", "bullish", "optimistic", "success", "win", "surge"
        ]
        self.negative_keywords = [
            "miss", "decline", "loss", "fall", "down", "weak", "negative",
            "bearish", "pessimistic", "fail", "drop", "crash", "plunge"
        ]
    
    def analyze_sentiment(self, headline: str) -> Dict[str, Any]:
        """
        Analyze sentiment of a news headline
        Returns deterministic results based on headline content
        """
        headline_lower = headline.lower()
        
        # Count positive and negative keywords
        positive_count = sum(1 for word in self.positive_keywords if word in headline_lower)
        negative_count = sum(1 for word in self.negative_keywords if word in headline_lower)
        
        # Create deterministic seed from headline
        seed = int(hashlib.md5(headline.encode()).hexdigest()[:8], 16)
        random.seed(seed)
        
        # Determine sentiment
        if positive_count > negative_count:
            sentiment = "Positive"
            base_score = 0.6 + random.uniform(0, 0.3)
        elif negative_count > positive_count:
            sentiment = "Negative"
            base_score = 0.2 + random.uniform(0, 0.3)
        else:
            sentiment = "Neutral"
            base_score = 0.4 + random.uniform(0, 0.2)
        
        return {
            "sentiment": sentiment,
            "sentimentScore": round(base_score, 2)
        }
    
    def analyze_batch(self, headlines: List[str]) -> List[Dict[str, Any]]:
        """Analyze sentiment for multiple headlines"""
        return [self.analyze_sentiment(headline) for headline in headlines]
    
    # TODO: Replace with real LLM-based sentiment analysis
    def _get_real_sentiment(self, headline: str) -> Dict[str, Any]:
        """
        Placeholder for real LLM-based sentiment analysis
        This would integrate with OpenAI, Anthropic, or other LLM APIs
        """
        pass

