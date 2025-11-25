from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.alert import Alert
from app.schemas.alert import AlertResponse, AlertCreate, Alert as AlertSchema
from app.core.deps import get_current_user

router = APIRouter()

@router.get("", response_model=AlertResponse)
async def get_alerts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's alerts"""
    alerts = db.query(Alert).filter(
        Alert.user_id == current_user.id
    ).all()
    
    return AlertResponse(items=[AlertSchema.from_orm(alert) for alert in alerts])

@router.post("", response_model=AlertSchema)
async def create_alert(
    alert_data: AlertCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new alert"""
    # Validate rule structure
    if not alert_data.rule.metric or not alert_data.rule.op or alert_data.rule.value is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid rule structure"
        )
    
    # Create alert
    new_alert = Alert(
        user_id=current_user.id,
        symbol=alert_data.symbol.upper(),
        rule=alert_data.rule.dict(),
        is_active="active"
    )
    
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    
    return AlertSchema.from_orm(new_alert)

@router.delete("/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_alert(
    alert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an alert"""
    alert = db.query(Alert).filter(
        Alert.id == alert_id,
        Alert.user_id == current_user.id
    ).first()
    
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    db.delete(alert)
    db.commit()

