from fastapi import FastAPI, HTTPException,Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from DB import crud, mssql
from sqlalchemy.ext.asyncio import AsyncSession
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}

class Item(BaseModel):
    user_id: str
    word: str
    count : int
    context : str

@app.post("/items/")
async def create_item(item: Item, db: AsyncSession = Depends(mssql.get_db)):
    try:
        await crud.Word.insert(
                db=db, 
                user_id=item.user_id,
                word=item.word, 
                count=item.count, 
                context=item.context
        )
        return item
    except Exception as e:
        await crud.Log.insert(db, f"Error occurred while inserting word record: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
