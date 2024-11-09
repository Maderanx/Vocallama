import React, { useState } from 'react';
import SiriWave from 'react-siriwave';
import './App.css';
import logo from './assets/voca.jpg';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [isSpeaking, setIsSpeaking] = useState(false); 
  
  const sendPrompt = async () => {
    setIsLoading(true);
    setIsSpeaking(false);
    setResponse('');

    const lowerCasePrompt = prompt.toLowerCase();
    if (['turn blue light on', 'turn green light on', 'turn red light on', 'turn off light'].includes(lowerCasePrompt)) {
      const color = lowerCasePrompt.split(' ')[1];
      await handleLightControl(color);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('http://192.168.4.2:5000/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      const responseText = data.response || 'No response from model';
      setResponse(responseText);
      speak(responseText);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error: Unable to process prompt');
      speak('Error: Unable to process prompt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLightControl = async (color) => {
    try {
      const response = await fetch('http://192.168.4.2:5000/turn_on_light', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error: Could not communicate with the backend.');
    }
  };

  const speak = (text) => {
    if (!text) return;
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="app-container">
      <img src={logo} alt="Vocallama Logo" className="logo-image" />

      <div className="input-container">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask me anything..."
          className="prompt-input"
        />
        <button onClick={sendPrompt} className="send-button">
          Send
        </button>
      </div>

      {isLoading ? (
        <div className="loading-animation">
          <div className="siri-dots">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <div className="response-container">
          <strong>{response || message}</strong>
        </div>
      )}

      {isSpeaking && (
        <div className="siriwave-animation">
          <SiriWave
            theme="ios9"
            amplitude={1}
            frequency={3}
            speed={0.08}
          />
        </div>
      )}
    </div>
  );
}

export default App;
