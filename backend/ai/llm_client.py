import os
import uuid
import logging
from emergentintegrations.llm.chat import LlmChat, UserMessage

logger = logging.getLogger(__name__)


class LLMClient:
    def __init__(self):
        self.api_key = os.environ.get("EMERGENT_LLM_KEY")
        self.provider = os.environ.get("LLM_PROVIDER", "openai")
        self.model = os.environ.get("LLM_MODEL", "gpt-4o")
        self.fallback_provider = os.environ.get("LLM_FALLBACK_PROVIDER", "gemini")
        self.fallback_model = os.environ.get("LLM_FALLBACK_MODEL", "gemini-2.5-flash")

    async def chat(self, system_prompt: str, messages: list, session_id: str = None) -> str:
        if not session_id:
            session_id = f"sess-{uuid.uuid4()}"

        # Build user message including history
        history_text = ""
        for msg in messages[:-1]:
            role = "User" if msg["role"] == "user" else "Assistant"
            history_text += f"{role}: {msg['content']}\n\n"

        latest = messages[-1]["content"] if messages else ""

        if history_text:
            full_message = f"[Previous conversation]\n{history_text}\n[Current message]\n{latest}"
        else:
            full_message = latest

        try:
            lc = LlmChat(
                api_key=self.api_key,
                session_id=session_id,
                system_message=system_prompt,
            ).with_model(self.provider, self.model)
            user_msg = UserMessage(text=full_message)
            response = await lc.send_message(user_msg)
            return response
        except Exception as e:
            logger.warning(f"Primary LLM failed ({self.provider}/{self.model}): {e}. Trying fallback.")
            try:
                fallback_session = f"{session_id}_fb"
                lc_fb = LlmChat(
                    api_key=self.api_key,
                    session_id=fallback_session,
                    system_message=system_prompt,
                ).with_model(self.fallback_provider, self.fallback_model)
                user_msg = UserMessage(text=full_message)
                return await lc_fb.send_message(user_msg)
            except Exception as e2:
                logger.error(f"Fallback LLM also failed: {e2}")
                raise


llm_client = LLMClient()
