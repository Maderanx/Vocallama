from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import time
import os
import signal
import ollama
import requests

# Run the Ollama model once to initialize
ollama_run_process = subprocess.Popen(['ollama', 'run', 'phi3.5'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print("Ollama model initialized with 'ollama run phi3.5'.")

# Start the Ollama server in the background
serve_process = subprocess.Popen(['ollama', 'serve'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print("Ollama server started.")

# Wait briefly to ensure the server has time to start
time.sleep(5)

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Initialize the Ollama client
client = ollama.Client()

@app.route('/prompt', methods=['POST'])
def process_prompt():
    data = request.get_json()
    user_prompt = data.get('prompt', '')
    print(user_prompt)
    # Create the messages structure for the Ollama chat
    messages = [
        {
            'role': 'system',
            'content': 'limit your responses to 20 words'
        },
        {
            'role': 'user',
            'content': user_prompt
        }
    ]

    try:
        # Send the messages to the Ollama model and get the response
        response = client.chat(model='phi3.5', messages=messages)

        # Extract and return the response
        model_response = response['message']['content']
        print(f"Received response from Ollama model: {model_response}")
        return jsonify({'response': model_response})
    except Exception as e:
        print(f"Error during model inference: {e}")
        return jsonify({'error': 'Failed to process prompt'}), 500

# Shut down handler to send /bye command when the script terminates
def shutdown_server():
    print("Sending '/bye' to the Ollama model to shut down.")
    try:
        # Send /bye to the Ollama model
        client.chat(model='phi3.5', messages=[{'role': 'user', 'content': '/bye'}])
    except Exception as e:
        print(f"Error during /bye command: {e}")
    finally:
        # Gracefully terminate the Ollama server process
        os.kill(serve_process.pid, signal.SIGTERM)
        print("Ollama server terminated.")

# Register shutdown handler to run on script termination
import atexit
atexit.register(shutdown_server)

@app.route('/turn_on_light', methods=['POST'])
def turn_on_light():
    data = request.get_json()
    color = data['color'].lower()
    
    # Map the color to the corresponding LED on ESP32
    esp32_url = 'http://192.168.4.1:80/'
    response = requests.post(esp32_url, json={'color': color})

    if response.status_code == 200:
        return jsonify({'message': f'{color} light turned on'}), 200
    return jsonify({'message': 'Failed to turn on light'}), 500

if __name__ == '__main__':
    print("Starting the Flask app with Ollama model ready...")
    app.run(host='0.0.0.0', port=5000)
