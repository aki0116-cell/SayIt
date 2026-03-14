from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

class Word:
    @staticmethod
    async def insert(db: AsyncSession, user_id: str, word: str, count: int, context: str):
        
        sql = text("""
            INSERT INTO word_records (user_id, word, count, context, timestamp)
            VALUES (:user_id, :word, :count, :context, GETDATE())
        """)

        await db.execute(sql, {
            "user_id": user_id,
            "word": word,
            "count": count,
            "context": context
        })
        await db.commit()

class Log:
    @staticmethod
    async def insert(db: AsyncSession, message: str):
        sql = text("""
            INSERT INTO log (message, timestamp)
            VALUES (:message, GETDATE())
        """)
        await db.execute(sql, {"message": message})
        await db.commit()