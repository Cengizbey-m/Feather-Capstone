from app.db.session import engine, Base
from app.models import user, watchlist, alert  # noqa: F401 - Imported to register models with SQLAlchemy

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)

