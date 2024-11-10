# Vocallama: AI Assistant 
# Who needs Internet? Not YOU

This project is an offline voice-controlled system for home automation, combining an ESP32 microcontroller, a Raspberry Pi running a Flask server, and a React front end. The setup enables voice-controlled LED lighting that is responsive to natural language commands without requiring an internet connection.


## Features

- **Fully Offline System**: Operates independently of the internet by creating a private Wi-Fi network on the ESP32. All communications, including voice processing, take place within this local network.
- **Natural Language Commands**: Accepts spoken commands to control LED colors (e.g., "Turn on blue light"), processed through a speech synthesis and recognition system.
- **Real-time Voice Feedback**: A Siri-like wave animation provides feedback when the system is processing voice input.
- **Simple Frontend**: A React web application allows users to input commands manually and displays responses, all hosted offline.
- **Automated Light Control**: LED lights connected to the ESP32 are controlled based on voice or text commands issued through the React frontend or directly from the Raspberry Pi.

## Technology Stack

- **Frontend**: React, HTML, CSS for user interface.
- **Backend**: Flask server on Raspberry Pi for API endpoints.
- **Microcontroller**: ESP32 for LED control.
- **Local AI Model**: `ollama/phi3.5` for local natural language processing on the Raspberry Pi.

## System Architecture

1. **ESP32 Wi-Fi Access Point**: The ESP32 creates a private Wi-Fi network that the Raspberry Pi and the frontend React app connect to.
2. **Raspberry Pi with Flask**: Handles voice commands, LED control, and connects to the `phi3.5` AI model for processing natural language.
3. **React Frontend**: Hosts the user interface, enabling command input, response display, and interaction with the offline AI model.

---

## Setup Instructions

### 1. ESP32 Configuration

1. Flash the ESP32 with the `ESP32_Automation.ino` code.
2. After flashing, the ESP32 will create a Wi-Fi access point with the SSID `ESP32_WAP` and password `12345678`.
3. Connect LEDs to the ESP32 pins specified in the code (`RED_PIN`, `GREEN_PIN`, `BLUE_PIN`) for controlling their colors.

### 2. Raspberry Pi with Flask

1. Clone the repository to the Raspberry Pi.
2. Install Python dependencies:

   ```bash
   pip install flask flask-cors requests
   ```

3. Run the Flask server:

   ```bash
   python3 app.py
   ```

### 3. Frontend React App

1. Navigate to the React app folder and install dependencies:

   ```bash
   npm install
   ```

2. Start the React app:

   ```bash
   npm start
   ```

3. Access the app on any device connected to the ESP32's Wi-Fi network.

---

## Usage

1. Open the React app in a browser connected to the ESP32's Wi-Fi.
2. Enter a command (e.g., “Turn on red light”) or speak it directly if using the text-to-speech feature.
3. The Flask server on the Raspberry Pi processes the command and sends the appropriate instruction to the ESP32.
4. The ESP32 responds by controlling the LEDs based on the command.

## Voice-Control Commands

Some example voice or text commands the system understands:
- "Turn on blue light"
- "Turn on red light"
- "Turn off light"
- "Turn on green light"

---

## Project Structure

- `App.css`: Defines the styling for the React app interface.
- `App.jsx`: Core React component, handling user input, sending commands, and displaying responses.
- `app.py`: Flask server script for the Raspberry Pi, hosting the API and communicating with the ESP32.
- `ESP32_Automation.ino`: Arduino sketch for the ESP32, which controls the LED based on the received commands.

## Offline Functionality

This project is designed to function completely offline. All devices connect via the ESP32’s Wi-Fi network, and no internet connection is required for:
1. Command processing on the `ollama/phi3.5` model.
2. LED control through the ESP32.
3. Real-time communication between the Raspberry Pi and React frontend.

---
