const express = require('express');
const AWS = require('aws-sdk');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// AWS S3 Configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'us-east-2',
});

const s3 = new AWS.S3();
const BUCKET_NAME = 'mental-health-companion';

// Azure AI Configuration
const AZURE_AI_ENDPOINT = 'https://jhash-ma9fwww9-eastus2.services.ai.azure.com/models';
const AZURE_AI_API_KEY = process.env.AZURE_AI_API_KEY;

// Save journal entry to S3
app.post('/journal', async (req, res) => {
  const { entry, userId, mood, tags } = req.body;

  if (!entry || !userId) {
    return res.status(400).json({ error: 'Entry and userId are required' });
  }

  const entryId = uuidv4();
  const journalEntry = {
    id: entryId,
    userId,
    entry,
    mood: mood || null,
    tags: tags || [],
    createdAt: new Date().toISOString(),
  };

  const params = {
    Bucket: BUCKET_NAME,
    Key: `${userId}/${entryId}.json`,
    Body: JSON.stringify(journalEntry),
    ContentType: 'application/json',
  };

  try {
    await s3.upload(params).promise();
    res.status(200).json({ message: 'Journal entry saved successfully', entryId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save journal entry: ' + error.message });
  }
});

// Retrieve journal entries for a user
app.get('/journal/:userId', async (req, res) => {
  const { userId } = req.params;

  const params = {
    Bucket: BUCKET_NAME,
    Prefix: `${userId}/`,
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    const entries = [];

    for (const item of data.Contents) {
      const objectData = await s3.getObject({ Bucket: BUCKET_NAME, Key: item.Key }).promise();
      const entry = JSON.parse(objectData.Body.toString());
      entries.push(entry);
    }

    res.status(200).json({ entries });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve journal entries: ' + error.message });
  }
});

// Delete a journal entry
app.delete('/journal/:userId/:entryId', async (req, res) => {
  const { userId, entryId } = req.params;

  const params = {
    Bucket: BUCKET_NAME,
    Key: `${userId}/${entryId}.json`,
  };

  try {
    await s3.deleteObject(params).promise();
    res.status(200).json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete journal entry: ' + error.message });
  }
});

// Chat endpoint using Azure AI
app.post('/chat', async (req, res) => {
  const { message, userId, mood } = req.body;

  if (!message || !userId) {
    return res.status(400).json({ error: 'Message and userId are required' });
  }

  try {
    // Construct the prompt with mood context if available
    let prompt = `You are an empathetic mental health companion. Respond to the user's message in a supportive and understanding way. User's message: "${message}".`;
    if (mood) {
      prompt += ` The user is feeling ${mood.toLowerCase()}. Adjust your tone accordingly.`;
    }

    const response = await axios.post(
      AZURE_AI_ENDPOINT,
      {
        prompt,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${AZURE_AI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices[0].text.trim();
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process chat: ' + (error.response?.data?.error || error.message) });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});