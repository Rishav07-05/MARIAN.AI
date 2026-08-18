import os
import json
import urllib.request
import urllib.error

# Basic helper to read .env manually to avoid dependency on dotenv
def load_env_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, "r") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key, val = line.split("=", 1)
                os.environ[key.strip()] = val.strip()

# Load env variables from backend/.env
load_env_file(".env")

api_key = os.getenv("GEMINI_API_KEY")
model_name = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

print(f"Testing model: {model_name}")
if api_key:
    print(f"API Key: {api_key[:5]}...{api_key[-5:]}")
else:
    print("API Key: None")

url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
payload = {
    "contents": [
        {
            "parts": [
                {"text": "Hello, is this API key working? Respond with a short confirmation."}
            ]
        }
    ]
}

data = json.dumps(payload).encode("utf-8")
req = urllib.request.Request(
    url,
    data=data,
    headers={"Content-Type": "application/json"},
    method="POST"
)

try:
    with urllib.request.urlopen(req) as response:
        status_code = response.getcode()
        body = response.read().decode("utf-8")
        print(f"Status Code: {status_code}")
        print("Success! Response from Gemini:")
        print(json.dumps(json.loads(body), indent=2))
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(e.read().decode("utf-8"))
except Exception as e:
    print(f"Error during API call: {e}")
