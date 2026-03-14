import json
import urllib.parse
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

DB_config = r"DB\config.json"
with open(DB_config, "r", encoding="utf-8") as f:
    config = json.load(f)

DATABASE_URL = (
    f"{config['DB_TYPE']}://{config['DB_HOST']}/{config['DB_NAME']}?"
    f"driver={urllib.parse.quote_plus(config['DB_DRIVER'])}&"
    f"Integrated+Security=SSPI"
)

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    bind=engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session