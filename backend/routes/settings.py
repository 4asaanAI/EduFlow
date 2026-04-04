from fastapi import APIRouter, Request, HTTPException
from database import get_db
from datetime import datetime

router = APIRouter(prefix="/api/settings", tags=["settings"])


def get_user(req: Request):
    return {
        "id": req.headers.get("X-User-Id", "user-owner-001"),
        "role": req.headers.get("X-User-Role", "owner"),
        "name": req.headers.get("X-User-Name", "Aman"),
    }


# --- Token Usage Tracking ---
@router.post("/token-usage")
async def track_token_usage(request: Request):
    """Track LLM token usage per user per month."""
    db = get_db()
    user = get_user(request)
    body = await request.json()
    tokens = int(body.get("tokens", 0))
    month = datetime.now().strftime("%Y-%m")
    await db.token_usage.update_one(
        {"user_id": user["id"], "month": month},
        {"$inc": {"tokens": tokens, "sessions": 1}, "$set": {"user_id": user["id"], "month": month}},
        upsert=True
    )
    return {"success": True}


@router.get("/token-usage")
async def get_token_usage(request: Request):
    """Get current user's token usage for current month."""
    db = get_db()
    user = get_user(request)
    month = datetime.now().strftime("%Y-%m")
    usage = await db.token_usage.find_one({"user_id": user["id"], "month": month}, {"_id": 0})
    if not usage:
        return {"success": True, "data": {"tokens": 0, "sessions": 0, "month": month, "limit": 50000}}
    usage["limit"] = 50000
    return {"success": True, "data": usage}


# --- Year-end Session Transition ---
@router.post("/year-end-transition")
async def year_end_transition(request: Request):
    """Transition to new academic year: create new year, promote students, archive old data."""
    db = get_db()
    user = get_user(request)
    if user["role"] not in ["owner", "admin"]:
        raise HTTPException(403, "Owner/Admin only")
    body = await request.json()
    new_year_name = body.get("new_year_name")  # e.g. "2026-27"
    if not new_year_name:
        raise HTTPException(400, "new_year_name required")

    import uuid
    # Create new academic year
    new_ay = {
        "id": str(uuid.uuid4()),
        "name": new_year_name,
        "start_date": body.get("start_date", f"{new_year_name[:4]}-04-01"),
        "end_date": body.get("end_date", f"{new_year_name[5:]}-03-31"),
        "is_current": True,
    }
    # Set all current years to not current
    await db.academic_years.update_many({"is_current": True}, {"$set": {"is_current": False}})
    await db.academic_years.insert_one({**new_ay, "_id": new_ay["id"]})

    # Count students promoted
    student_count = await db.students.count_documents({"is_active": True})

    return {
        "success": True,
        "data": {
            "new_year": new_ay,
            "students_carried_forward": student_count,
            "message": f"Transitioned to {new_year_name}. {student_count} students carried forward. Previous year archived.",
        }
    }


# --- CRUD: Soft Delete students ---
# (In students.py) —-- handled there


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
