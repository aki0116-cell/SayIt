import asyncio
from DB.mssql import AsyncSessionLocal 
from sqlalchemy import text

async def test():
    async with AsyncSessionLocal() as session:
        result = await session.execute(text("SELECT 1"))
        print("連線成功！資料庫回傳：", result.scalar())

if __name__ == "__main__":
    asyncio.run(test())