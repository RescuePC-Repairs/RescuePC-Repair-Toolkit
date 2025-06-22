#!/usr/bin/env python3
"""
RescuePC Repairs - Groq AI Assistant
====================================
Ultra-fast AI assistant powered by Groq's free API
for instant codebase analysis and development help.
"""

import os
import json
import requests
import glob
from pathlib import Path

class RescuePCGroqAssistant:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("❌ GROQ_API_KEY environment variable not set!")
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama3-70b-8192"  # Best free model
        
    def ask_groq(self, prompt, system_prompt=None):
        """Make request to Groq API"""
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        try:
            response = requests.post(
                self.base_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": messages,
                    "temperature": 0.1,
                    "max_tokens": 4000
                }
            )
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            return f"❌ Error: {str(e)}"
    
    def analyze_project(self):
        """Quick project analysis"""
        print("🔍 Analyzing RescuePC Repairs project...")
        
        # Get file structure
        files = {
            'html': glob.glob('**/*.html', recursive=True),
            'js': glob.glob('**/*.js', recursive=True), 
            'css': glob.glob('**/*.css', recursive=True),
            'config': glob.glob('**/*.json', recursive=True)
        }
        
        # Read key files
        key_files = {}
        for file in ['index.html', 'src/main.js', 'package.json']:
            if os.path.exists(file):
                with open(file, 'r', encoding='utf-8') as f:
                    content = f.read()[:1500]  # First 1500 chars
                    key_files[file] = content
        
        prompt = f"""Analyze this RescuePC Repairs website project:

FILE STRUCTURE:
{json.dumps(files, indent=2)}

KEY FILES CONTENT:
{json.dumps(key_files, indent=2)}

Provide:
1. Architecture assessment
2. Security evaluation  
3. Performance recommendations
4. Code quality insights
5. Next steps for improvement"""

        system_prompt = "You are an expert web developer and security specialist. Provide concise, actionable analysis."
        
        return self.ask_groq(prompt, system_prompt)
    
    def security_check(self):
        """Security analysis"""
        print("🔒 Running security analysis...")
        
        # Check security files
        security_files = []
        patterns = ['**/security*', '**/*https*', '**/.htaccess', '**/netlify.toml']
        for pattern in patterns:
            security_files.extend(glob.glob(pattern, recursive=True))
        
        content = {}
        for file in security_files[:5]:  # Limit files
            if os.path.isfile(file):
                with open(file, 'r', encoding='utf-8') as f:
                    content[file] = f.read()[:800]
        
        prompt = f"""Security audit for RescuePC Repairs:

SECURITY FILES:
{json.dumps(content, indent=2)}

Check for:
1. HTTPS enforcement issues
2. CSP vulnerabilities
3. XSS protection
4. Data validation gaps
5. Authentication weaknesses

Provide specific fixes."""

        return self.ask_groq(prompt, "You are a cybersecurity expert. Focus on web security vulnerabilities and fixes.")
    
    def performance_audit(self):
        """Performance optimization suggestions"""
        print("⚡ Analyzing performance...")
        
        # Check performance-critical files
        files_to_check = ['index.html', 'vite.config.js', 'src/main.js']
        content = {}
        
        for file in files_to_check:
            if os.path.exists(file):
                with open(file, 'r', encoding='utf-8') as f:
                    content[file] = f.read()[:1200]
        
        prompt = f"""Performance audit for RescuePC Repairs:

FILES:
{json.dumps(content, indent=2)}

Analyze:
1. Bundle size optimization
2. Loading performance
3. Critical resource prioritization
4. Caching strategies
5. Web Vitals improvements

Provide specific optimizations with expected impact."""

        return self.ask_groq(prompt, "You are a web performance expert. Focus on measurable improvements.")
    
    def code_review(self, file_path):
        """Review specific file"""
        if not os.path.exists(file_path):
            return f"❌ File not found: {file_path}"
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        prompt = f"""Code review for: {file_path}

CODE:
{content}

Review for:
1. Code quality
2. Best practices
3. Potential bugs
4. Security issues
5. Performance impact

Provide specific improvements."""

        return self.ask_groq(prompt, "You are a senior developer doing code review. Be thorough but concise.")
    
    def chat_mode(self):
        """Interactive chat"""
        print("\n🤖 RescuePC AI Assistant - Chat Mode")
        print("Commands: /analyze, /security, /performance, /review <file>, /quit")
        print("-" * 50)
        
        while True:
            try:
                question = input("\n💬 Ask me anything: ").strip()
                
                if question.lower() in ['/quit', 'quit', 'exit']:
                    break
                elif question == '/analyze':
                    print("\n" + self.analyze_project())
                elif question == '/security':
                    print("\n" + self.security_check())
                elif question == '/performance':
                    print("\n" + self.performance_audit())
                elif question.startswith('/review '):
                    file_path = question[8:].strip()
                    print("\n" + self.code_review(file_path))
                elif question:
                    system_prompt = "You are an expert web developer helping with the RescuePC Repairs project. Provide specific, actionable advice."
                    response = self.ask_groq(f"Question about RescuePC project: {question}", system_prompt)
                    print(f"\n🤖 {response}")
                    
            except KeyboardInterrupt:
                break
        
        print("\n👋 Goodbye!")

def main():
    """Main menu"""
    assistant = RescuePCGroqAssistant()
    
    print("🚀 RescuePC Repairs - AI Assistant (Powered by Groq)")
    print("=" * 55)
    print("1. 🔍 Full Project Analysis")
    print("2. 🔒 Security Audit") 
    print("3. ⚡ Performance Optimization")
    print("4. 💬 Interactive Chat Mode")
    print("5. 📝 Code Review (specify file)")
    
    choice = input("\nChoose option (1-5): ").strip()
    
    if choice == '1':
        print("\n" + assistant.analyze_project())
    elif choice == '2':
        print("\n" + assistant.security_check())
    elif choice == '3':
        print("\n" + assistant.performance_audit())
    elif choice == '4':
        assistant.chat_mode()
    elif choice == '5':
        file_path = input("Enter file path: ").strip()
        print("\n" + assistant.code_review(file_path))
    else:
        print("Starting chat mode...")
        assistant.chat_mode()

if __name__ == "__main__":
    main() 