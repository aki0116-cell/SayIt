from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

class Word:
    @staticmethod
    async def insert_base(db: AsyncSession, word: str, cword: int, context: str):

        res = await db.execute(
            text("INSERT INTO objects (type) OUTPUT inserted.object_id VALUES ('word')")
        )
        oid = res.scalar()

        await db.execute(
            text("""
                INSERT INTO word (object_id, word, cword, context)
                VALUES (:obj_id, :word, :cword, :context)
            """),
            {
                "obj_id": oid, 
                "word": word,
                "cword": cword,
                "context": context
            }
        )
        await db.commit() 
        return oid

class User:
    @staticmethod
    async def insert_base(db: AsyncSession, uid_str: str, name: str):
        res = await db.execute(
            text("INSERT INTO objects (type) OUTPUT inserted.object_id VALUES ('user')")
        )
        oid = res.scalar()
        
        await db.execute(
            text("""
                INSERT INTO user_info (object_id, user_id_string, username)
                VALUES (:obj_id, :user_id_string, :name)
            """),
            {
                "obj_id": oid,
                "user_id_string": uid_str,
                "name": name
            }
        )
        await db.commit()
        return oid


class Orel:

    _REL_TYPE_UTW = 'user_to_word'
    _REL_TYPE_WTU = 'word_to_user'

    @staticmethod
    async def user_to_word(db: AsyncSession, uid: int, wid: int):

        res = await db.execute(
            text("""
                INSERT INTO orel (from_id, to_id, rel_type, count)
                VALUES (:uid, :wid, :rel, 1)
            """),
            {
                "uid": uid,
                "wid": wid,
                "rel": Orel._REL_TYPE_UTW  
            }
        )
        rid = res.scalar()
        await db.commit()
        return rid
    
    @staticmethod
    async def word_to_user(db: AsyncSession, wid: int, uid: int):
        res = await db.execute(
            text("""
                INSERT INTO orel (from_id, to_id, rel_type, count)
                VALUES (:wid, :uid, :rel, 1)
            """),
            {
                "wid": wid,
                "uid": uid,
                "rel": Orel._REL_TYPE_WTU  
            }
        )
        rid = res.scalar()
        await db.commit()
        return rid
        


class Log:
    @staticmethod
    async def insert(db: AsyncSession, message: str):
        sql = text("""
            INSERT INTO log (message, timestamp)
            VALUES (:message, GETDATE())
        """)
        await db.execute(sql, {"message": message})
        await db.commit()