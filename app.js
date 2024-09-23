const express = require('express');
const bodyParser = require('body-parser');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Google Text-to-Speech client
const client = new textToSpeech.TextToSpeechClient();

// Command Processing Route
app.post('/process-command', async (req, res) => {
    const userCommand = req.body.command.toLowerCase();
    let responseText = '';

    // Logic for processing commands
    if (userCommand.includes('play a song')) {
        responseText = 'Playing your favorite song!';
        // Add integration with Spotify API to play songs
    } else if (userCommand.includes('search google')) {
        responseText = 'Searching Google...';
        // Add integration with Google Search API for search results
    } else if (userCommand.includes('show map')) {
        responseText = 'Displaying map for you.';
        // Add integration with Google Maps API
    } else {
        responseText = 'I am sorry, I do not understand the command.';
    }

    // Generate voice response using Google TTS
    const request = {
        input: {text: responseText},
        voice: {languageCode: 'en-US', ssmlGender: 'FEMALE'},
        audioConfig: {audioEncoding: 'MP3'},
    };

    const [ttsResponse] = await client.synthesizeSpeech(request);
    const audioFile = `output${Date.now()}.mp3`;
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(audioFile, ttsResponse.audioContent, 'binary');

    // Respond with the generated text and audio URL
    res.json({
        response: responseText,
        audioUrl: '/' + audioFile // Serve the audio file
    });
});

// Serve generated audio files
app.use('/output', express.static(path.join(__dirname, 'output')));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
