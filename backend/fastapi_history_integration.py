# Example: How to integrate chat history with your Python FastAPI

# Add this to your main.py to save chat history to Node.js backend

import requests
import json

async def save_chat_to_history(question: str, answer: str, user_token: str):
    """Save chat to Node.js backend chat history"""
    try:
        headers = {
            'Authorization': f'Bearer {user_token}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'question': question,
            'answer': answer
        }
        
        response = requests.post(
            'http://localhost:4000/api/chat-history/save',
            headers=headers,
            json=data,
            timeout=5
        )
        
        if response.status_code == 201:
            print("Chat saved to history successfully")
            return True
        else:
            print(f"Failed to save chat: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"Error saving chat history: {e}")
        return False

# Modified chat endpoint to include history saving
class ChatRequest(BaseModel):
    question: str
    user_token: Optional[str] = None  # Add user token for authentication

@app.post("/chat")
async def ask_question(request: ChatRequest):
    try:
        # Your existing QA logic...
        current_qa_chain = get_or_initialize_qa_chain()
        if current_qa_chain:
            result = current_qa_chain.invoke(request.question)
            answer = str(result)
            
            # Save to chat history if user is logged in
            if request.user_token:
                await save_chat_to_history(request.question, answer, request.user_token)
            
            return {
                "answer": answer,
                "success": True,
                "saved_to_history": bool(request.user_token)
            }
        
    except Exception as e:
        return {"answer": f"Error: {str(e)}", "success": False}
