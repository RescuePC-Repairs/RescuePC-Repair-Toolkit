import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
prompt = """
You are an AI developer. Write code to:
- Add a dark mode toggle to an HTML/CSS/JS website
- Use TailwindCSS
- Persist mode using localStorage
- Detect system preference
- Apply it across navigation and hero sections
"""

response = requests.post(
    "https://api.groq.com/openai/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    },
    json={
        "model": "mixtral-8x7b-32768",
        "messages": [
            {"role": "system", "content": "You are a full-stack web developer."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }
)

print(response.json()['choices'][0]['message']['content'])
