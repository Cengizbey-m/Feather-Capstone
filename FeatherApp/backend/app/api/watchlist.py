from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.watchlist import WatchlistItem
from app.schemas.watchlist import WatchlistResponse, WatchlistCreate
from app.core.deps import get_current_user

router = APIRouter()

@router.get("", response_model=WatchlistResponse)
async def get_watchlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's watchlist"""
    watchlist_items = db.query(WatchlistItem).filter(
        WatchlistItem.user_id == current_user.id
    ).all()
    
    symbols = [item.symbol for item in watchlist_items]
    return WatchlistResponse(items=symbols)

@router.post("", status_code=status.HTTP_200_OK)
async def add_to_watchlist(
    watchlist_item: WatchlistCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add symbol to user's watchlist"""
    # Check if already in watchlist
    existing = db.query(WatchlistItem).filter(
        WatchlistItem.user_id == current_user.id,
        WatchlistItem.symbol == watchlist_item.symbol.upper()
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Symbol already in watchlist"
        )
    
    # Add to watchlist
    new_item = WatchlistItem(
        user_id=current_user.id,
        symbol=watchlist_item.symbol.upper()
    )
    db.add(new_item)
    db.commit()
    
    return {"message": "Symbol added to watchlist"}

@router.delete("/{symbol}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_watchlist(
    symbol: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove symbol from user's watchlist"""
    watchlist_item = db.query(WatchlistItem).filter(
        WatchlistItem.user_id == current_user.id,
        WatchlistItem.symbol == symbol.upper()
    ).first()
    
    if not watchlist_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Symbol not found in watchlist"
        )
    
    db.delete(watchlist_item)
    db.commit()

