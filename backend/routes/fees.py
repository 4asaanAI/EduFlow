from fastapi import APIRouter, Request, HTTPException
from database import get_db
from models.schemas import FeePaymentRequest, FeeTransaction
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/fees", tags=["fees"])


def get_user(req: Request):
    return {
        "id": req.headers.get("X-User-Id", "user-owner-001"),
        "role": req.headers.get("X-User-Role", "owner"),
    }


@router.get("/structures")
async def get_fee_structures(request: Request):
    db = get_db()
    user = get_user(request)
    if user["role"] not in ["owner", "admin"]:
        raise HTTPException(403, "Forbidden")
    structures = await db.fee_structures.find({}, {"_id": 0}).to_list(50)
    return {"success": True, "data": structures}


@router.get("/transactions")
async def get_fee_transactions(request: Request, student_id: str = None, status: str = None):
    db = get_db()
    user = get_user(request)
    if user["role"] not in ["owner", "admin"]:
        raise HTTPException(403, "Forbidden")

    query = {}
    if student_id:
        query["student_id"] = student_id
    if status:
        query["status"] = status

    txns = await db.fee_transactions.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    # Enrich with student names
    for t in txns:
        student = await db.students.find_one({"id": t["student_id"]}, {"_id": 0})
        t["student_name"] = student["name"] if student else "Unknown"
    return {"success": True, "data": txns}


@router.get("/my")
async def get_my_fees(request: Request):
    db = get_db()
    user = get_user(request)
    student = await db.students.find_one({"user_id": user["id"]}, {"_id": 0})
    if not student:
        raise HTTPException(404, "Student record not found")
    txns = await db.fee_transactions.find({"student_id": student["id"]}, {"_id": 0}).to_list(50)
    return {"success": True, "data": txns}


@router.post("/transactions")
async def record_payment(body: FeePaymentRequest, request: Request):
    db = get_db()
    user = get_user(request)
    if user["role"] not in ["owner", "admin"]:
        raise HTTPException(403, "Forbidden")

    receipt = f"RCP{datetime.now().strftime('%Y%m%d')}{uuid.uuid4().hex[:6].upper()}"
    txn = FeeTransaction(
        student_id=body.student_id,
        fee_type=body.fee_type,
        amount=body.amount,
        status="paid",
        paid_date=datetime.now().strftime("%Y-%m-%d"),
        payment_mode=body.payment_mode,
        receipt_number=receipt,
        transaction_ref=body.transaction_ref,
    )
    await db.fee_transactions.insert_one({**txn.dict(), "_id": txn.id})
    return {"success": True, "data": txn.dict()}


@router.get("/summary")
async def get_fee_summary(request: Request):
    db = get_db()
    user = get_user(request)
    if user["role"] not in ["owner", "admin"]:
        raise HTTPException(403, "Forbidden")

    pipeline = [{"$group": {"_id": "$status", "total": {"$sum": "$amount"}, "count": {"$sum": 1}}}]
    stats = await db.fee_transactions.aggregate(pipeline).to_list(10)
    return {"success": True, "data": {s["_id"]: {"total": s["total"], "count": s["count"]} for s in stats}}
