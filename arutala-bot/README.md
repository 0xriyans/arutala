# 🤖 Arutala AI Concierge Bot Service

[← Back to Main Repository README](../README.md)

The **Arutala Bot Service** is a dedicated Generative AI microservice powered by **Google Gemini 2.5 Flash**, providing customers with an interactive, conversational perfumer concierge experience ("Find My Scent").

## 🛠️ Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **LLM Engine**: [Google Gemini 2.5 Flash SDK](https://ai.google.dev/) (`google-generativeai`)
- **Server**: Uvicorn ASGI Server

## 🌟 Key Features

- **Sophisticated Perfumer Persona**: Strict prompt engineering enforcing the tone and expertise of a master Parisian perfumer.
- **Function Calling / Tool Execution**: Dynamically executes backend queries (e.g. searching fragrances, checking order status) to respond with live data.
- **Rich Interactive UI Payloads**: Streams specialized action tags that the React frontend renders into interactive product cards and "Add to Bag" buttons inside the chat window.

## 📁 Directory Structure

```text
arutala-bot/
├── app/               # FastAPI application code & Gemini prompt handlers
├── main.py            # Microservice entry point (Port 8001)
└── requirements.txt
```
