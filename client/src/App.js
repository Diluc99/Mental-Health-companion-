import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [mood, setMood] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [tags, setTags] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [chatError, setChatError] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [showEntries, setShowEntries] = useState(false);
  const canvasRef = useRef(null);

  const userId = 'user_mtquscvzl'; // User ID as per screenshot

  const moodOptions = [
    { name: 'Happy', emoji: '😊' },
    { name: 'Sad', emoji: '😢' },
    { name: 'Anxious', emoji: '😟' },
    { name: 'Calm', emoji: '😊' },
    { name: 'Excited', emoji: '🤩' }
  ];

  // Map moods to numerical values for the graph
  const moodValues = {
    Happy: 5,
    Excited: 4,
    Calm: 3,
    Anxious: 2,
    Sad: 1,
  };

  // Categorize moods into positive and negative for dual-line graph
  const positiveMoods = ['Happy', 'Excited', 'Calm'];
  const negativeMoods = ['Sad', 'Anxious'];

  const handleSaveJournal = async () => {
    if (!journalEntry.trim()) {
      alert('Please enter a journal entry.');
      return;
    }

    const tagArray = tags.trim() ? tags.split(',').map(tag => tag.trim()) : [];

    try {
      const response = await axios.post('http://localhost:3000/journal', {
        entry: journalEntry,
        userId,
        mood: mood || null,
        tags: tagArray,
      });
      alert(response.data.message);
      setJournalEntry('');
      setTags('');
      setMood('');
      fetchJournalEntries();
    } catch (error) {
      alert('Error saving journal: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleChat = async () => {
    if (!chatMessage.trim()) {
      alert('Please enter a chat message.');
      return;
    }

    setChatError(null);
    setChatResponse('');
    setChatResponse('Processing chat...');

    try {
      const response = await axios.post('http://localhost:3000/chat', {
        message: chatMessage,
        userId,
        mood,
      });
      setChatResponse(response.data.reply);
      setChatMessage('');
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setChatError(`Error processing chat: ${errorMessage}`);
      setChatResponse('');
    }
  };

  const fetchJournalEntries = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/journal/${userId}`);
      setJournalEntries(response.data.entries);
    } catch (error) {
      alert('Error fetching journal entries: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      await axios.delete(`http://localhost:3000/journal/${userId}/${entryId}`);
      alert('Journal entry deleted');
      fetchJournalEntries();
    } catch (error) {
      alert('Error deleting journal entry: ' + (error.response?.data?.error || error.message));
    }
  };

  const toggleShowEntries = () => {
    if (!showEntries) {
      fetchJournalEntries();
    }
    setShowEntries(!showEntries);
  };

  // Draw the mood history graph with dual lines (positive and negative moods)
  useEffect(() => {
    if (showEntries && journalEntries.length > 1 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      // Clear the canvas
      ctx.clearRect(0, 0, width, height);

      // Set up the graph dimensions
      const padding = 50;
      const graphWidth = width - 2 * padding;
      const graphHeight = height - 2 * padding;
      const maxMoodValue = 5;
      const minMoodValue = 1;

      // Draw grid lines (background)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      // Horizontal grid lines (mood levels)
      for (let i = 0; i <= 4; i++) {
        const y = height - padding - ((i + 1) / maxMoodValue) * graphHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }

      // Draw y-axis labels (moods)
      ctx.font = '12px Poppins';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'right';
      const moodLabels = ['Sad', 'Anxious', 'Calm', 'Excited', 'Happy'];
      for (let i = 0; i <= 4; i++) {
        const y = height - padding - ((i + 1) / maxMoodValue) * graphHeight;
        ctx.fillText(moodLabels[i], padding - 10, y + 5);
      }

      // Draw x-axis labels (dates)
      ctx.textAlign = 'center';
      const dates = journalEntries.map(entry => new Date(entry.createdAt).toLocaleTimeString());
      for (let i = 0; i < dates.length; i++) {
        const x = padding + (i / (dates.length - 1)) * graphWidth;
        ctx.fillStyle = '#ffffff';
        ctx.save();
        ctx.translate(x, height - padding + 30);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(dates[i], 0, 0);
        ctx.restore();
      }

      // Prepare data for positive and negative moods
      const positiveMoodData = journalEntries.map(entry => {
        if (positiveMoods.includes(entry.mood)) return moodValues[entry.mood];
        return null;
      });
      const negativeMoodData = journalEntries.map(entry => {
        if (negativeMoods.includes(entry.mood)) return moodValues[entry.mood];
        return null;
      });

      // Plot the positive mood line (blue)
      const plotLine = (data, color) => {
        let points = [];
        data.forEach((value, i) => {
          if (value !== null) {
            const x = padding + (i / (data.length - 1)) * graphWidth;
            const y = height - padding - ((value - minMoodValue) / (maxMoodValue - minMoodValue)) * graphHeight;
            points.push({ x, y });
          }
        });

        if (points.length > 0) {
          let progress = 0;
          const animate = () => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            for (let i = 0; i < points.length - 1; i++) {
              const startX = points[i].x;
              const startY = points[i].y;
              const endX = points[i + 1].x;
              const endY = points[i + 1].y;

              const currentProgress = Math.min(progress, 1);
              const interpolatedX = startX + (endX - startX) * currentProgress;
              const interpolatedY = startY + (endY - startY) * currentProgress;

              if (i === 0) {
                ctx.moveTo(startX, startY);
              }

              if (progress >= (i + 1) / (points.length - 1)) {
                ctx.lineTo(endX, endY);
              } else if (progress >= i / (points.length - 1)) {
                ctx.lineTo(interpolatedX, interpolatedY);
                break;
              }
            }

            ctx.stroke();

            // Draw dots at data points
            for (let i = 0; i < points.length; i++) {
              if (progress >= i / (points.length - 1)) {
                ctx.beginPath();
                ctx.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = color;
                ctx.fill();
              }
            }

            if (progress < 1) {
              progress += 0.02;
              requestAnimationFrame(animate);
            }
          };

          animate();
        }
      };

      // Plot both lines
      plotLine(positiveMoodData, '#42a5f5'); // Blue for positive moods
      plotLine(negativeMoodData, '#ef5350'); // Red for negative moods

      // Draw legend
      ctx.fillStyle = '#42a5f5';
      ctx.fillRect(width - padding - 100, padding - 20, 15, 5);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('Positive Mood', width - padding - 80, padding - 15);

      ctx.fillStyle = '#ef5350';
      ctx.fillRect(width - padding - 100, padding - 5, 15, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Negative Mood', width - padding - 80, padding);
    }
  }, [showEntries, journalEntries]);

  return (
    <div className="App">
      <div className="header fade-in">
        <h1>Mental Health Companion</h1>
        <p>User ID: {userId}</p>
      </div>

      <div className="section fade-in" style={{ animationDelay: '0.2s' }}>
        <h2>How Are You Feeling?</h2>
        <div className="mood-buttons">
          {moodOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => setMood(option.name)}
              className={`mood-button ${mood === option.name ? 'active' : ''}`}
            >
              {option.name} {option.emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="section fade-in" style={{ animationDelay: '0.4s' }}>
        <h2>Journal Entry</h2>
        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          placeholder="Write your journal entry here..."
          className="journal-input"
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma-separated, e.g., work, stress)"
          className="tags-input"
        />
        <button onClick={handleSaveJournal} className="save-button">
          Save Entry
        </button>
      </div>

      <div className="section fade-in" style={{ animationDelay: '0.6s' }}>
        <h2>Chat with Your Companion</h2>
        <div className="chat-container">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Talk to your companion..."
            className="chat-input"
          />
          <button onClick={handleChat} className="send-button">Send</button>
        </div>
        {chatResponse && (
          <div className="chat-response fade-in">
            <p>{chatResponse}</p>
          </div>
        )}
        {chatError && (
          <div className="chat-error fade-in">
            <p>{chatError}</p>
          </div>
        )}
      </div>

      <div className="section fade-in" style={{ animationDelay: '0.8s' }}>
        <h2>Journal History</h2>
        <button onClick={toggleShowEntries} className="toggle-button">
          {showEntries ? 'Hide Past Entries' : 'View Past Entries'}
        </button>

        {showEntries && (
          <div>
            {journalEntries.length > 0 ? (
              <div>
                {journalEntries.some(entry => moodValues[entry.mood]) && journalEntries.filter(entry => moodValues[entry.mood]).length > 1 && (
                  <div className="graph-container fade-in">
                    <h3>Mood Trend</h3>
                    <canvas
                      ref={canvasRef}
                      width="600"
                      height="300"
                      className="mood-graph"
                    ></canvas>
                  </div>
                )}
                {journalEntries.map((entry, index) => (
                  <div key={entry.id} className={`journal-entry slide-in`} style={{ animationDelay: `${index * 0.1}s` }}>
                    <p>
                      <strong>Date:</strong>{' '}
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                    {entry.mood && (
                      <p>
                        <strong>Mood:</strong> {entry.mood}
                      </p>
                    )}
                    <p>
                      <strong>Entry:</strong> {entry.entry}
                    </p>
                    {entry.tags && entry.tags.length > 0 && (
                      <p>
                        <strong>Tags:</strong> {entry.tags.join(', ')}
                      </p>
                    )}
                    <button onClick={() => handleDeleteEntry(entry.id)} className="delete-button">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="fade-in">No journal entries found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;