const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { fromIni } = require('@aws-sdk/credential-provider-ini');
const { TextDecoder } = require('util');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: 'us-east-1', // or your desired AWS region
  credentials: fromIni(), // loads from ~/.aws/credentials or environment vars
});

app.post('/api/analyze', async (req, res) => {
  const { sender, email } = req.body;

  const prompt = `
Human: You are a cybersecurity expert trained to detect phishing emails.
Analyze the following information and respond with:

1. Verdict: "Phishing" or "Not Phishing"
2. A short explanation (2-3 bullet points)
3. Any red flags in the sender email address

Sender Email:
${sender}

Email Content:
"""
${email}
"""

Assistant:
`;

  try {
    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-v2',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        prompt: prompt,
        max_tokens_to_sample: 500,
        temperature: 0.2,
      }),
    });

    const response = await bedrockClient.send(command);
    const decoded = new TextDecoder().decode(response.body);
    const result = JSON.parse(decoded);

    res.json({ result: result.completion });
  } catch (err) {
    console.error('Error invoking Bedrock:', err);
    res.status(500).json({ error: 'Something went wrong with Bedrock call' });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
