# Mental Health Companion 🌟


A beautifully designed web application to support your mental health journey through journaling, AI-powered chat, and mood trend visualization. Built with React, Express, and Azure AI's DeepSeek-V3-0324 model, this app empowers users to track their emotions, reflect on their experiences, and receive empathetic support. 💬📝

## ✨ Project Overview
The Mental Health Companion app offers a safe space to:

📝 **Journal Your Thoughts**: Write daily journal entries, tag them, and associate them with your current mood.
💬 **Chat with an AI Companion**: Get empathetic responses powered by Azure AI's DeepSeek-V3-0324 model.
📈 **Track Mood Trends**: Visualize your mood over time with an attractive dual-line graph (positive vs. negative moods).
🗑️ **Manage Entries**: View, revisit, and delete past journal entries with ease.

The app features a sleek, modern design with a dark blue gradient theme, glassmorphism effects, and smooth animations, making it both functional and visually appealing. 🌙

## 🏆 Hackathon Victory
I’m proud to share that this project won the AIZureStack CertifyO Hackathon, held virtually on May 4, 2025! 🏆 Organized by CertifyO, the 8-hour hackathon focused on creating innovative solutions using Azure technologies. I participated solo under the team name AIZureStack CertifyO Hackathon, leveraging Azure AI's DeepSeek-V3-0324 model and AWS S3 to build this privacy-focused mental health tool. 🕒💻
The journey was intense but rewarding—integrating DeepSeek for empathetic chat responses and designing the mood graph pushed my skills to the limit. CertifyO’s mentorship was invaluable, and winning the hackathon was a moment of pure joy! Reflecting on May 21, 2025, at 12:03 PM IST, I’m excited to share this project with the world. 🌟

## 🚀 Setup Instructions

Follow these steps to set up and run the project locally:

### Prerequisites
- 🛠️ Node.js and npm installed
- ☁️ AWS S3 bucket (mental-health-companion) with appropriate IAM permissions
- 🧠 Azure AI resource with DeepSeek-V3-0324 model deploye


### Steps

1. **Clone the Repository** 📥
```
git clone https://github.com/Diluc99/Mental-Health-companion-.git
cd Mental-Health-companion-
```

3. **Install Dependencies** ⚙️
 - For the frontend:
     ```
     cd client
     npm install
     ```
   - For the backend:
     ```
     cd ../server
     npm install
     ```




3. **Set Up Environment Variables** 🔑
   - Create a server/.env file with the following:
     ```
     AWS_ACCESS_KEY=your_access_key_id
     AWS_SECRET_KEY=your_secret_access_key
     AZURE_AI_API_KEY=your_azure_ai_api_key
     ```
   - Replace the placeholders with your actual AWS and Azure AI credentials.



4. **Run the Backend** 🖥️
   ```
   cd server
   npm start
   ```
   The backend will run on http://localhost:3000.

5. **Run the Frontend** 🌐
   - In a new terminal:
     ```
     cd client
     set PORT=3001 && npm start
     ```
   - Open http://localhost:3001 in your browser.



6. **Explore the App** 🎉
   - Write a journal entry, select a mood, and add tags.
   - Chat with the AI companion.
   - View your journal history and mood trend graph.




### Notes

- Ensure your Azure AI resource has the DeepSeek-V3-0324 model deployed with the endpoint https://jhash-ma9fwww9-eastus2.services.ai.azure.com/models.
- The app uses AWS S3 to store journal entries in the mental-health-companion bucket.


## 🌟 Motive Behind the Project
Mental health is a critical aspect of overall well-being, yet many people struggle to find accessible, non-judgmental support. The Mental Health Companion was created to:

🛡️ **Provide a Safe Space**: A private, user-friendly platform to express thoughts and emotions without fear of judgment.
🤖 **Leverage AI for Support**: Use Azure AI’s DeepSeek-V3-0324 model to offer empathetic, context-aware responses, simulating a supportive companion.
📊 **Promote Self-Awareness**: Help users track their mood trends over time, fostering reflection and emotional understanding.
🎨 **Make It Engaging**: Combine a visually stunning design (dark blue gradient, glassmorphism, animations) with intuitive features to encourage regular use.

The goal is to empower users to take charge of their mental health journey, one journal entry at a time. 💪

## 🎮Why It’s a Game Changer
This app stands out as a game changer in mental health support for several reasons:

- **AI-Powered Empathy** 🤖: Unlike traditional journaling apps, the AI companion provides real-time, empathetic responses, making users feel heard and understood.
- **Dual Mood Tracking** 📈: The mood trend graph visualizes both positive and negative moods over time, offering deeper insights into emotional patterns.
- **Stunning Design** 🌌: The modern, glassmorphism-inspired design with smooth animations makes the app a joy to use, encouraging consistent engagement.
- **Privacy First** 🔒: Journal entries are securely stored in AWS S3, ensuring user data remains private and protected.
- **Accessibility** 🌍: The app is free to use locally, making mental health support accessible to anyone with a computer and internet connection.
tools. 🚀

By combining technology, design, and empathy, the Mental Health Companion redefines how users interact with mental health 
## 🔮 Future Improvements

To make the app even better, here are some ideas for future enhancements:

- 📅 **Mood Calendar View**: Add a calendar to visualize mood trends on a daily, weekly, or monthly basis.
- 🔔 **Reminders & Notifications**: Implement reminders to encourage daily journaling or check-ins.
- 🎯 **Goal Setting**: Allow users to set mental health goals (e.g., "Journal 5 times this week") and track progress.
- 📊 **Advanced Analytics**: Provide deeper insights, such as mood correlations with tags or time of day.
- 🌐 **Mobile App**: Develop iOS and Android versions for on-the-go access.
- 🧠 **Enhanced AI Features**: Integrate sentiment analysis to provide more personalized responses or suggest coping strategies based on mood trends.
- 🌈 **Customization**: Let users choose themes (e.g., light mode, different gradients) to personalize their experience.
- 🤝 **Community Support**: Add an optional feature for users to connect anonymously with others for peer support.



These additions can further elevate the app, making it a comprehensive mental health toolkit. 🚀

## 🤝 Contributing
Contributions are welcome! Please:

Fork the repository 🍴
-Create a feature branch (git checkout -b feature/AmazingFeature) 🌿
-Commit your changes (git commit -m 'Add some AmazingFeature') 💾
-Push to the branch (git push origin feature/AmazingFeature) 🚀
-Open a Pull Request 📬

*For major changes, please open an issue first to discuss your ideas*. 🌟

## 📧 Contact
For questions or feedback, reach out to jhashivam53741@gmail.com. Let’s make mental health support better together! 💖

## 🤖 AI Disclosure

This project was developed with the assistance of Grok 3, an AI created by xAI. Grok 3 helped with coding, debugging, and generating parts of this README.md file. The AI was used to enhance productivity and ensure a polished final product, while the core ideas, design decisions, and implementation were driven by me, Shivam Jha. 🧠


