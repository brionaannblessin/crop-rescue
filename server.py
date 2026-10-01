from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
import os


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)


client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY")
)


SYSTEM_INSTRUCTION = """
You are the Crop Rescue AI Assistant.

You are part of an educational farming simulation game called Crop Rescue.

The project's topic is:

"Crop Residue Burning Increasing Air Pollution
and Reducing Soil Quality."

Your job is to help players:

1. Understand how to play the game.
2. Explain the game's episodes and choices.
3. Explain crop residue.
4. Explain why burning crop residue causes air pollution.
5. Explain how residue burning can affect soil quality.
6. Explain soil erosion and soil conservation.
7. Explain biological pest control.
8. Explain mulching.
9. Explain composting.
10. Explain biomass processing.
11. Answer questions about sustainable farming.
12. Answer reasonable questions about the Crop Rescue project.

Give simple, accurate educational explanations suitable
for a college project demonstration.

Keep answers concise but useful.

If the player asks how to play:
Explain that they select a crop, face three farming
challenges, make decisions, harvest the crop, and then
manage the remaining crop residue.

If a question is unrelated to farming, the game,
agriculture, soil, crop residue, pollution, or this project,
politely say that you are designed primarily to help with
Crop Rescue and its educational topic.

Do not invent statistics or scientific facts.
"""


class ChatRequest(BaseModel):

    message: str


from fastapi.responses import StreamingResponse
import json


@app.post("/api/chat")
async def chat(request: ChatRequest):

    try:

        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",

            contents=request.message,

            config={
                "thinking_config": {
                    "thinking_level": "minimal"
                },

                "system_instruction": SYSTEM_INSTRUCTION
            }
        )

        return {
            "reply": response.text
        }

    except Exception as e:

        print("Gemini error:", repr(e), flush=True)

        return {
            "reply": "⚠️ The AI assistant is currently unavailable."
        }