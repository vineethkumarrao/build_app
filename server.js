const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // For making HTTP requests
require('dotenv').config(); // Load environment variables from .env

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serves your HTML, CSS, and JS from the public folder

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'; // OpenAI API endpoint
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Use environment variable

app.post('/generate', async (req, res) => {
    const { idea } = req.body; // Get the idea from the frontend

    try {
        // Call OpenAI API to generate code based on the user's idea
        const openAIResponse = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Specify the model you want to use
                messages: [{ role: "user", content: `Generate the full HTML and JavaScript code for: ${idea}` }]
            }),
        });

        const openAIData = await openAIResponse.json();

        // Check for errors in the OpenAI response
        if (openAIData.error) {
            return res.status(400).json({ error: openAIData.error.message });
        }

        const generatedCode = openAIData.choices[0]?.message?.content || ''; // Extract generated code from response

        res.json({ generatedCode });
    } catch (error) {
        console.error('Error generating code:', error);
        res.status(500).json({ error: 'Failed to generate code' });
    }
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
