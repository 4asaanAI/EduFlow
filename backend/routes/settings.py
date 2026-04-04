from fastapi import APIRouter, Request, HTTPException
from database import get_db

router = APIRouter(prefix="/api/settings", tags=["settings"])


def get_user(req: Request):
    return {
        "id": req.headers.get("X-User-Id", "user-owner-001"),
        "role": req.headers.get("X-User-Role", "owner"),
        "name": req.headers.get("X-User-Name", "Aman"),
    }


@router.patch("/school")
async def update_school_settings(request: Request):
    db = get_db()
    user = get_user(request)
    if user["role"] not in ["owner"]:
        raise HTTPException(403, "Owner only")
    body = await request.json()
    allowed = {"attendance_threshold", "school_name", "board", "city", "ai_context"}
    update = {k: v for k, v in body.items() if k in allowed}
    from datetime import datetime as dt
    await db.school_settings.update_one({"id": "main"}, {"$set": {**update, "updated_at": dt.now().isoformat()}})
    return {"success": True}


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
    allowed = {"preferred_language", "theme", "notifications", "attendance_threshold"}
    update = {k: v for k, v in body.items() if k in allowed}
    await db.users.update_one({"id": user["id"]}, {"$set": update}, upsert=True)
    # Also persist notification settings to user_settings collection
    if "notifications" in update:
        from datetime import datetime as dt
        await db.user_settings.update_one(
            {"user_id": user["id"]},
            {"$set": {"notifications": update["notifications"], "updated_at": dt.now().isoformat()}},
            upsert=True
        )
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


@router.get("/forms")
async def list_forms(request: Request):
    db = get_db()
    forms = await db.custom_forms.find({}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return {"success": True, "data": forms}


@router.post("/forms")
async def create_form(request: Request):
    db = get_db()
    user = get_user(request)
    if user["role"] not in ["admin", "owner"]:
        from fastapi import HTTPException
        raise HTTPException(403, "Forbidden")
    body = await request.json()
    from datetime import datetime as dt
    import uuid
    form = {
        "id": str(uuid.uuid4()),
        "title": body.get("title"),
        "fields": body.get("fields", []),
        "audience": body.get("audience", "all"),
        "created_by": user["id"],
        "is_active": True,
        "created_at": dt.now().isoformat(),
    }
    await db.custom_forms.insert_one({**form, "_id": form["id"]})
    return {"success": True, "data": form}
async def get_academic_year(request: Request):
    db = get_db()
    ay = await db.academic_years.find_one({"is_current": True}, {"_id": 0})
    return {"success": True, "data": ay}
