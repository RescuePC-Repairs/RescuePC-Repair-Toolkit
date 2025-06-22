# 🔒 SECURITY SETUP - URGENT

## ⚠️ EXPOSED API KEY DETECTED

Your Groq API key was exposed in the repository. **IMMEDIATE ACTIONS REQUIRED:**

### 1. 🚨 REVOKE THE EXPOSED KEY

1. Go to https://console.groq.com/keys
2. **IMMEDIATELY REVOKE** the key: `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`
3. Generate a new API key

### 2. 🔧 SET UP ENVIRONMENT VARIABLES

1. Create a `.env` file in your project root:
```bash
# .env (never commit this file!)
GROQ_API_KEY=your_new_groq_api_key_here
```

2. **VERIFY** `.env` is in your `.gitignore` (✅ already done)

### 3. 🧹 CLEAN GIT HISTORY

The exposed key is in your Git history. Run these commands:

```bash
# Remove the exposed key from Git history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch scripts/groq-assistant.py scripts/ai-assistant.py' \
  --prune-empty --tag-name-filter cat -- --all

# Force push to remove history
git push origin --force --all
```

### 4. ✅ VERIFICATION

After setup, test the scripts:

```bash
# Set your API key
export GROQ_API_KEY="your_new_key_here"

# Test
python scripts/groq-assistant.py
```

### 5. 🛡️ BEST PRACTICES

- **NEVER** hardcode API keys in source code
- **ALWAYS** use environment variables
- **VERIFY** `.env` files are in `.gitignore`
- **REGULARLY** rotate API keys
- **MONITOR** for exposed secrets

### 6. 📚 FILES FIXED

- ✅ `scripts/groq-assistant.py` - Now uses `GROQ_API_KEY` env var
- ✅ `scripts/ai-assistant.py` - Now uses `GROQ_API_KEY` env var

### 7. 🔍 SECURITY SCAN

Consider using tools like:
- `git-secrets` to prevent future exposures
- `truffleHog` to scan for exposed secrets
- GitHub secret scanning (should have caught this)

---

**Remember:** Security is an ongoing process, not a one-time setup! 🔐 