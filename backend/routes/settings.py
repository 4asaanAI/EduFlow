from fastapi import APIRouter, Request
from database import get_db

router = APIRouter(prefix="/api/settings", tags=["settings"])


def get_user(req: Request):
    return {
        "id": req.headers.get("X-User-Id", "user-owner-001"),
        "role": req.headers.get("X-User-Role", "owner"),
        "name": req.headers.get("X-User-Name", "Aman"),
    }


@router.get("/me")
async def get_settings(request: Request):
    db = get_db()
    user = get_user(request)
    user_rec = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    if not user_rec:
        return {"success": True, "data": {"preferred_language": "en", "theme": "dark"}}
    return {"success": True, "data": {"preferred_language": user_rec.get("preferred_language", "en"), "theme": "dark"}}


@router.patch("/me")
async def update_settings(request: Request):
    db = get_db()
    user = get_user(request)
    body = await request.json()
    allowed = {"preferred_language", "theme"}
    update = {k: v for k, v in body.items() if k in allowed}
    await db.users.update_one({"id": user["id"]}, {"$set": update})
    return {"success": True}


@router.get("/school")
async def get_school_settings(request: Request):
    db = get_db()
    settings = await db.school_settings.find_one({"id": "main"}, {"_id": 0})
    if not settings:
        import os
        settings = {
            "school_name": os.environ.get("SCHOOL_NAME", "The Aaryans"),
            "board": os.environ.get("SCHOOL_BOARD", "CBSE"),
            "city": os.environ.get("SCHOOL_CITY", "Lucknow"),
            "state": os.environ.get("SCHOOL_STATE", "Uttar Pradesh"),
        }
    return {"success": True, "data": settings}


@router.get("/classes")
async def get_classes(request: Request):
    db = get_db()
    classes = await db.classes.find({}, {"_id": 0}).to_list(50)
    return {"success": True, "data": classes}


@router.get("/academic-year")
async def get_academic_year(request: Request):
    db = get_db()
    ay = await db.academic_years.find_one({"is_current": True}, {"_id": 0})
    return {"success": True, "data": ay}
