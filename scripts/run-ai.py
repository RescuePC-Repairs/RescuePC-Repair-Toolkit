#!/usr/bin/env python3
"""
RescuePC Repairs - AI Assistant Quick Runner
============================================
One-click launch for your AI development assistant
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("📦 Installing requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
        print("✅ Requirements installed!")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install requirements")
        return False

def run_assistant():
    """Run the AI assistant"""
    if not os.path.exists("groq-assistant.py"):
        print("❌ groq-assistant.py not found!")
        return
    
    try:
        print("🚀 Launching RescuePC AI Assistant...")
        subprocess.run([sys.executable, "groq-assistant.py"])
    except Exception as e:
        print(f"❌ Error running assistant: {e}")

def main():
    print("🤖 RescuePC Repairs - AI Assistant Launcher")
    print("=" * 45)
    
    # Check if requests is installed
    try:
        import requests
        print("✅ Dependencies ready")
    except ImportError:
        print("📦 Installing dependencies...")
        if not install_requirements():
            return
    
    # Run the assistant
    run_assistant()

if __name__ == "__main__":
    main() 