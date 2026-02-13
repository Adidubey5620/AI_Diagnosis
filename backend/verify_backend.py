import os
import sys
import subprocess
import time
import requests

def verify_backend():
    print("Starting backend for verification...")
    # Start uvicorn in background
    # Since we are now in the backend folder, we run uvicorn from here
    # We set PYTHONPATH to the current directory to ensure 'app' is found
    # We use the parent directory as PYTHONPATH to let uvicorn find 'app' module
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    env = os.environ.copy()
    env["PYTHONPATH"] = script_dir
    
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--port", "8000"],
        cwd=script_dir,
        env=env,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    try:
        # Wait for startup
        time.sleep(5)
        
        # Check if running
        if proc.poll() is not None:
             stdout, stderr = proc.communicate()
             print("Backend failed to start:")
             print(stderr)
             return False
             
        # Ping root endpoint
        try:
            resp = requests.get("http://localhost:8000/")
            if resp.status_code == 200:
                print("Backend root endpoint verified!")
                return True
            else:
                print(f"Backend returned status {resp.status_code}")
                return False
        except Exception as e:
            print(f"Failed to connect to backend: {e}")
            return False
            
    finally:
        proc.terminate()
        proc.wait()

if __name__ == "__main__":
    if verify_backend():
        print("Verification SUCCESS")
        sys.exit(0)
    else:
        print("Verification FAILED")
        sys.exit(1)
