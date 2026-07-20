import os
import google.generativeai as genai
from typing import List, Dict, Any, Optional
import httpx
import asyncio

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

backend_url = os.getenv("MAIN_BACKEND_URL", "http://127.0.0.1:8000").replace("localhost", "127.0.0.1")

def get_order_status(order_ref: str) -> str:
    """Gets the shipping status and details of an order using its order reference."""
    try:
        response = httpx.get(f"{backend_url}/api/orders/track/{order_ref}", timeout=10.0)
        if response.status_code == 200:
            data = response.json()
            courier = data.get('shipping_courier', 'Courier')
            tracking = data.get('tracking_number', 'Not yet available')
            status = data.get('status', 'UNKNOWN')
            return f"Order {order_ref} status is {status}. Tracking Number: {tracking} via {courier}."
        else:
            return f"Could not find order {order_ref}. Please check the reference number."
    except Exception as e:
        return f"Error tracking order: {str(e)}"

def search_fragrances(query: str) -> str:
    """
    Searches the Arutala catalog for fragrances matching the query or family.
    Use this when a user asks for recommendations, specific notes, or to explore products.
    """
    try:
        response = httpx.get(f"{backend_url}/api/products/", timeout=10.0)
        if response.status_code == 200:
            products = response.json()
            
            # Simple text filter
            q = query.lower()
            results = []
            for p in products:
                # Check name, family, description, notes
                searchable = f"{p.get('name', '')} {p.get('family', '')} {p.get('description', '')}".lower()
                notes = p.get('notes', {})
                for n_type in ['top', 'heart', 'base']:
                    searchable += " " + " ".join(notes.get(n_type, [])).lower()
                
                # Check if query words are in searchable text
                if all(word in searchable for word in q.split()):
                    results.append(p)
            
            if not results:
                # If too strict, return all to let Gemini pick
                results = products
            
            # Format top 3 results
            catalog = f"Found {len(results)} matching fragrances. Here are the top matches:\n"
            for p in results[:3]:
                catalog += f"- Name: {p.get('name')}\n"
                catalog += f"  Slug: {p.get('slug')}\n"
                catalog += f"  Family: {p.get('family')}\n"
                catalog += f"  Price: IDR {p.get('price')}\n"
                catalog += f"  Description: {p.get('description')}\n"
                notes = p.get('notes', {})
                if notes:
                    catalog += f"  Top Notes: {', '.join(n.get('name', '') for n in notes.get('top', []))}\n"
                    catalog += f"  Heart Notes: {', '.join(n.get('name', '') for n in notes.get('heart', []))}\n"
                    catalog += f"  Base Notes: {', '.join(n.get('name', '') for n in notes.get('base', []))}\n"
                catalog += "\n"
            return catalog
        else:
            return "Failed to fetch products from catalog."
    except Exception as e:
        return f"Error searching fragrances: {str(e)}"

SYSTEM_PROMPT = f"""You are the official Arutala Fragrance expert assistant. 
Your role is to help customers find their signature scent, explain fragrance notes, and answer questions about Arutala's products. 
Be polite, sophisticated, and evocative in your descriptions, much like a Parisian perfumer. 
If asked about things unrelated to fragrances, gently steer the conversation back to Arutala's perfumes.
Keep your responses concise, engaging, and format them nicely using Markdown (bullet points, bold text).

CRITICAL RULE: You MUST ALWAYS respond in English, regardless of what language the user uses to speak to you. Even if the user speaks in Indonesian, your replies must always be in English.

QUIZ INTEGRATION (Find My Scent):
If a user asks to find a perfume, take a quiz, or asks for recommendations, DO NOT just list products immediately. Instead, act as an expert interactive quiz guide.
1. You must ask at least 3-4 sequential, branching questions. Ask ONLY ONE question at a time in English.
2. Adapt your next question based on their previous answer (e.g., if they say they like 'Daytime', next ask if they prefer 'Fresh beach vibes' or 'Lush spring gardens').
3. Offer 3 to 4 distinct, vivid, and creative options for each question to make it engaging.
4. Only after fully understanding their profile (after at least 3 questions), use the search_fragrances tool to find and recommend the perfect match based on their specific journey.

CRITICAL INSTRUCTIONS FOR TAGS:
1. RECOMMENDATIONS: Whenever you specifically recommend a product, you MUST include a special tag formatted exactly as `[PRODUCT:product_slug]` directly after mentioning the product name, where `product_slug` is the exact Slug from the catalog. E.g., "... I recommend Swarna [PRODUCT:swarna] for its sweet notes..."
2. ADD TO CART: If the user explicitly asks to buy, purchase, or add a specific product to their cart, you MUST output the exact tag `[ADD_TO_CART:product_slug]` (where product_slug is the exact slug of the product). E.g., "I've added it for you. [ADD_TO_CART:senja]"
"""

try:
    model = genai.GenerativeModel(
        'gemini-2.5-flash', 
        system_instruction=SYSTEM_PROMPT,
        tools=[get_order_status, search_fragrances]
    )
except Exception as e:
    print(f"Warning: Failed to initialize Gemini model. Ensure GEMINI_API_KEY is set. Error: {e}")
    model = None

async def generate_chat_response(message: str, history: List[Any]) -> str:
    if not model:
        return "I apologize, but my connection to the fragrance knowledge base is currently unavailable."
    
    formatted_history = []
    for msg in history:
        role = 'model' if msg.role == 'assistant' else 'user'
        formatted_history.append({'role': role, 'parts': [msg.content]})
        
    try:
        chat = model.start_chat(history=formatted_history)
        response = chat.send_message(message)
        return response.text
    except Exception as e:
        print(f"Error generating response: {e}")
        return "Pardon me, I seem to have lost my train of thought. Could you rephrase that?"

async def generate_chat_response_stream(message: str, history: List[Any], customer_name: Optional[str] = None, customer_id: Optional[str] = None):
    if not model:
        yield "I apologize, but my connection to the fragrance knowledge base is currently unavailable."
        return
        
    formatted_history = []
    for msg in history:
        role = 'model' if msg.role == 'assistant' else 'user'
        formatted_history.append({'role': role, 'parts': [msg.content]})
        
    try:
        chat = model.start_chat(
            history=formatted_history,
            enable_automatic_function_calling=True
        )
        
        # Inject personalization if available
        context_msg = message
        if customer_name:
            context_msg = f"[System: The user is currently logged in as {customer_name}. Greet them or refer to them by name if appropriate.]\n{message}"

        # Use stream=False to allow automatic function calling to complete
        response = chat.send_message(context_msg, stream=False)
        
        # Fake the stream so the UI still looks nice
        if response.text:
            # Split by chunks of 5 characters for a smooth typing effect
            text = response.text
            chunk_size = 5
            for i in range(0, len(text), chunk_size):
                yield text[i:i+chunk_size]
                await asyncio.sleep(0.01)
            
    except Exception as e:
        print(f"Error generating stream response: {e}")
        yield "\nPardon me, I seem to have lost my train of thought. Could you rephrase that?"
