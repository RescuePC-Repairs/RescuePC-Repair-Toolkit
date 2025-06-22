import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

prompt = """
Add a dark mode toggle to an HTML website.
Use TailwindCSS.
Persist with localStorage.
Auto-detect system dark mode preference.
Update navigation and hero sections accordingly.
"""

response = requests.post(
    "https://api.groq.com/openai/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    },
    json={
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }
)

content = response.json()["choices"][0]["message"]["content"]
print("\n--- Response ---\n")
print(content)
