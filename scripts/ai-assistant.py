#!/usr/bin/env python3
"""
RescuePC Repairs - AI Engineering Assistant
===========================================
Ultra-advanced AI agent powered by Groq for codebase analysis,
optimization suggestions, and development assistance.

Features:
- Codebase analysis and understanding
- Performance optimization suggestions
- Security vulnerability detection
- Code quality improvements
- Architecture recommendations
- Real-time development assistance
"""

import os
import json
import glob
import requests
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime

# Configuration
@dataclass
class AIConfig:
    """AI Assistant Configuration"""
    api_key: str = "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"
    base_url: str = "https://api.groq.com/openai/v1/chat/completions"
    model: str = "meta-llama/llama-3.1-70b-versatile"  # Best for code analysis
    max_tokens: int = 4000
    temperature: float = 0.1  # Low for precise code analysis
    project_root: Path = Path(".")

class RescuePCAIAssistant:
    """Ultra-Advanced AI Engineering Assistant for RescuePC Repairs"""
    
    def __init__(self, config: AIConfig = None):
        self.config = config or AIConfig()
        self.project_files = {}
        self.analysis_cache = {}
        self.session_history = []
        
        # Initialize project analysis
        self._scan_project()
        
    def _scan_project(self) -> None:
        """Scan and categorize all project files"""
        print("🔍 Scanning RescuePC Repairs codebase...")
        
        file_patterns = {
            'html': '**/*.html',
            'css': '**/*.css',
            'javascript': '**/*.js',
            'json': '**/*.json',
            'config': '**/.*rc* **/.*config* **/*.config.*',
            'docs': '**/*.md **/*.txt',
            'assets': '**/assets/**/*',
            'components': '**/src/components/**/*',
            'security': '**/security* **/*security*'
        }
        
        for category, pattern in file_patterns.items():
            files = []
            for p in pattern.split():
                files.extend(glob.glob(p, recursive=True))
            
            self.project_files[category] = [
                f for f in files 
                if os.path.isfile(f) and not f.startswith('.git/') and not f.startswith('node_modules/')
            ]
        
        total_files = sum(len(files) for files in self.project_files.values())
        print(f"✅ Scanned {total_files} files across {len(self.project_files)} categories")
    
    def _make_groq_request(self, messages: List[Dict], system_prompt: str = None) -> str:
        """Make request to Groq API with error handling"""
        try:
            if system_prompt:
                messages.insert(0, {"role": "system", "content": system_prompt})
            
            response = requests.post(
                self.config.base_url,
                headers={
                    "Authorization": f"Bearer {self.config.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.config.model,
                    "messages": messages,
                    "temperature": self.config.temperature,
                    "max_tokens": self.config.max_tokens
                },
                timeout=30
            )
            
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
            
        except requests.exceptions.RequestException as e:
            return f"❌ API Error: {str(e)}"
        except Exception as e:
            return f"❌ Unexpected Error: {str(e)}"
    
    def analyze_codebase(self) -> str:
        """Comprehensive codebase analysis"""
        print("🧠 Performing deep codebase analysis...")
        
        # Prepare codebase summary
        summary = {
            "project_name": "RescuePC Repairs",
            "file_structure": self.project_files,
            "key_files": {
                "main_html": "index.html",
                "main_js": "src/main.js",
                "main_css": "src/styles/main.css",
                "config": "vite.config.js"
            }
        }
        
        # Read key files for analysis
        key_content = {}
        key_files = ["index.html", "src/main.js", "package.json", "vite.config.js"]
        
        for file_path in key_files:
            if os.path.exists(file_path):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        # Truncate if too long
                        if len(content) > 2000:
                            content = content[:2000] + "\n... [truncated]"
                        key_content[file_path] = content
                except Exception as e:
                    key_content[file_path] = f"Error reading file: {e}"
        
        system_prompt = """You are an elite software architect and security expert analyzing the RescuePC Repairs codebase. 
        Provide a comprehensive analysis covering:
        1. Architecture quality and patterns
        2. Security implementation
        3. Performance optimizations
        4. Code quality and maintainability
        5. Potential vulnerabilities or issues
        6. Specific actionable recommendations
        
        Be precise, technical, and provide specific line numbers or code examples where relevant."""
        
        messages = [{
            "role": "user",
            "content": f"""Analyze this RescuePC Repairs codebase:

PROJECT STRUCTURE:
{json.dumps(summary, indent=2)}

KEY FILE CONTENTS:
{json.dumps(key_content, indent=2)}

Please provide a detailed technical analysis with specific recommendations for improvements."""
        }]
        
        analysis = self._make_groq_request(messages, system_prompt)
        self.analysis_cache["codebase_analysis"] = {
            "timestamp": datetime.now().isoformat(),
            "analysis": analysis
        }
        
        return analysis
    
    def security_audit(self) -> str:
        """Perform security audit of the codebase"""
        print("🔒 Performing security audit...")
        
        # Read security-related files
        security_files = []
        patterns = ["**/security*", "**/*security*", "**/*.config.*", "**/.*rc*"]
        
        for pattern in patterns:
            security_files.extend(glob.glob(pattern, recursive=True))
        
        security_content = {}
        for file_path in security_files[:10]:  # Limit to prevent token overflow
            if os.path.isfile(file_path):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if len(content) > 1000:
                            content = content[:1000] + "\n... [truncated]"
                        security_content[file_path] = content
                except:
                    continue
        
        system_prompt = """You are a cybersecurity expert performing a security audit. 
        Focus on:
        1. HTTPS implementation and enforcement
        2. Content Security Policy (CSP) configuration
        3. XSS and injection vulnerabilities
        4. Authentication and authorization
        5. Data validation and sanitization
        6. Secure coding practices
        
        Provide specific, actionable security recommendations."""
        
        messages = [{
            "role": "user",
            "content": f"""Perform a security audit on these RescuePC Repairs files:

SECURITY-RELATED FILES:
{json.dumps(security_content, indent=2)}

Identify vulnerabilities and provide specific recommendations."""
        }]
        
        return self._make_groq_request(messages, system_prompt)
    
    def optimize_performance(self) -> str:
        """Analyze and suggest performance optimizations"""
        print("⚡ Analyzing performance optimization opportunities...")
        
        # Read performance-critical files
        perf_files = ["index.html", "src/main.js", "vite.config.js", "package.json"]
        perf_content = {}
        
        for file_path in perf_files:
            if os.path.exists(file_path):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if len(content) > 1500:
                            content = content[:1500] + "\n... [truncated]"
                        perf_content[file_path] = content
                except:
                    continue
        
        system_prompt = """You are a performance optimization expert. Analyze for:
        1. Bundle size optimization
        2. Lazy loading implementation
        3. Critical resource prioritization
        4. Caching strategies
        5. Code splitting opportunities
        6. Web Vitals improvements (LCP, FID, CLS)
        
        Provide specific, measurable optimization recommendations."""
        
        messages = [{
            "role": "user",
            "content": f"""Analyze performance optimization opportunities for RescuePC Repairs:

PERFORMANCE-CRITICAL FILES:
{json.dumps(perf_content, indent=2)}

Suggest specific optimizations with expected impact."""
        }]
        
        return self._make_groq_request(messages, system_prompt)
    
    def code_review(self, file_path: str) -> str:
        """Perform detailed code review of specific file"""
        print(f"📝 Reviewing code: {file_path}")
        
        if not os.path.exists(file_path):
            return f"❌ File not found: {file_path}"
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            return f"❌ Error reading file: {e}"
        
        system_prompt = """You are a senior code reviewer. Provide detailed feedback on:
        1. Code quality and readability
        2. Best practices adherence
        3. Potential bugs or issues
        4. Performance implications
        5. Security considerations
        6. Maintainability improvements
        
        Be specific and provide code examples for improvements."""
        
        messages = [{
            "role": "user",
            "content": f"""Review this code file from RescuePC Repairs:

FILE: {file_path}
CONTENT:
{content}

Provide detailed code review with specific recommendations."""
        }]
        
        return self._make_groq_request(messages, system_prompt)
    
    def suggest_features(self) -> str:
        """Suggest new features and improvements"""
        print("💡 Generating feature suggestions...")
        
        system_prompt = """You are a product strategist and UX expert. Based on the RescuePC Repairs codebase, 
        suggest innovative features and improvements that would:
        1. Enhance user experience
        2. Improve conversion rates
        3. Add competitive advantages
        4. Leverage modern web technologies
        5. Improve accessibility and inclusivity
        
        Provide specific, implementable suggestions with technical details."""
        
        messages = [{
            "role": "user",
            "content": f"""Based on the RescuePC Repairs project structure:
{json.dumps(self.project_files, indent=2)}

Suggest innovative features and improvements that would make this Windows repair toolkit website more effective and user-friendly."""
        }]
        
        return self._make_groq_request(messages, system_prompt)
    
    def interactive_chat(self) -> None:
        """Interactive chat mode for development assistance"""
        print("\n🤖 RescuePC AI Assistant - Interactive Mode")
        print("=" * 50)
        print("Commands:")
        print("  /analyze    - Full codebase analysis")
        print("  /security   - Security audit")
        print("  /performance - Performance optimization")
        print("  /review <file> - Code review specific file")
        print("  /features   - Feature suggestions")
        print("  /quit       - Exit")
        print("=" * 50)
        
        while True:
            try:
                user_input = input("\n💬 Ask me anything about your codebase: ").strip()
                
                if user_input.lower() in ['/quit', 'quit', 'exit']:
                    print("👋 Goodbye! Happy coding!")
                    break
                
                if user_input == '/analyze':
                    print(self.analyze_codebase())
                elif user_input == '/security':
                    print(self.security_audit())
                elif user_input == '/performance':
                    print(self.optimize_performance())
                elif user_input.startswith('/review '):
                    file_path = user_input[8:].strip()
                    print(self.code_review(file_path))
                elif user_input == '/features':
                    print(self.suggest_features())
                elif user_input:
                    # General chat
                    system_prompt = """You are an expert software engineer familiar with the RescuePC Repairs codebase. 
                    Provide helpful, specific, and actionable advice for web development, JavaScript, HTML, CSS, 
                    security, performance, and best practices."""
                    
                    messages = [{
                        "role": "user",
                        "content": f"Question about RescuePC Repairs project: {user_input}"
                    }]
                    
                    response = self._make_groq_request(messages, system_prompt)
                    print(f"\n🤖 {response}")
                    
            except KeyboardInterrupt:
                print("\n👋 Goodbye! Happy coding!")
                break
            except Exception as e:
                print(f"❌ Error: {e}")

def main():
    """Main entry point"""
    print("🚀 RescuePC Repairs - AI Engineering Assistant")
    print("=" * 60)
    
    assistant = RescuePCAIAssistant()
    
    # Show menu
    print("\nChoose an option:")
    print("1. Full Codebase Analysis")
    print("2. Security Audit")
    print("3. Performance Optimization")
    print("4. Feature Suggestions")
    print("5. Interactive Chat Mode")
    print("6. Code Review (specify file)")
    
    try:
        choice = input("\nEnter your choice (1-6): ").strip()
        
        if choice == '1':
            print("\n" + assistant.analyze_codebase())
        elif choice == '2':
            print("\n" + assistant.security_audit())
        elif choice == '3':
            print("\n" + assistant.optimize_performance())
        elif choice == '4':
            print("\n" + assistant.suggest_features())
        elif choice == '5':
            assistant.interactive_chat()
        elif choice == '6':
            file_path = input("Enter file path to review: ").strip()
            print("\n" + assistant.code_review(file_path))
        else:
            print("❌ Invalid choice. Starting interactive mode...")
            assistant.interactive_chat()
            
    except KeyboardInterrupt:
        print("\n👋 Goodbye! Happy coding!")

if __name__ == "__main__":
    main() 