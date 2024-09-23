// Web Speech API for speech recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';

// DOM Elements
const micButton = document.getElementById('microphone-btn');
const transcriptElem = document.getElementById('transcript');
const responseElem = document.getElementById('response');

micButton.addEventListener('click', () => {
    recognition.start(); // Start listening for speech input
});

recognition.onresult = (event) => {
    const voiceCommand = event.results[0][0].transcript;
    transcriptElem.textContent = 'You said: ' + voiceCommand;

    // Send the command to the server for processing
    fetch('/process-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: voiceCommand })
    })
    .then(response => response.json())
    .then(data => {
        responseElem.textContent = 'Response: ' + data.response;
        
        // Play the audio response (voice output)
        const audio = new Audio(data.audioUrl);
        audio.play();
    })
    .catch(error => {
        responseElem.textContent = 'Error: ' + error.message;
    });
};
