from motor.motor_asyncio import AsyncIOMotorClient
import os

_client = None
_db = None


async def connect_db():
    global _client, _db
    _client = AsyncIOMotorClient(os.environ["MONGO_URL"])
    _db = _client[os.environ["DB_NAME"]]
    await _create_indexes()


async def disconnect_db():
    if _client:
        _client.close()


def get_db():
    return _db


async def _create_indexes():
    db = _db
    await db.students.create_index("class_id")
    await db.students.create_index("admission_number", unique=True, sparse=True)
    await db.student_attendance.create_index(
        [("student_id", 1), ("date", 1)], unique=True
    )
    await db.staff_attendance.create_index(
        [("staff_id", 1), ("date", 1)], unique=True
    )
    await db.fee_transactions.create_index("student_id")
    await db.fee_transactions.create_index("status")
    await db.messages.create_index("conversation_id")
    await db.conversations.create_index("user_id")
    await db.assignments.create_index("class_id")
    await db.leave_requests.create_index("staff_id")
    await db.enquiries.create_index("status")
