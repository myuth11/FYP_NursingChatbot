require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/userModel'); // Import the User model

const app = express();
const PORT = process.env.PORT || 4000; // Changed to 4000 to avoid conflict with Python server

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const chatbotRoute = require('./routes/chatbotRoutes');
const userRoutes = require('./routes/user');
const quizRoutes = require('./routes/quizRoutes');
const chatHistoryRoutes = require('./routes/chatHistoryRoutes');

app.use('/chatbot', chatbotRoute);
app.use('/api/user', userRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/chat-history', chatHistoryRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Nursing Chatbot backend is running.');
});

// Connect to database
connectDB();

// TEMPORARY: Add a user on server start (remove/comment after first run)
// const addUser = async () => {
//   const email = 'test12345@office.com';
//   const password = 'Test12345!';
//   try {
//     await User.signup(email, password);
//     console.log('User created:', email);
//   } catch (err) {
//     console.log('Could not create user:', err.message);
//   }
// };
// // Call addUser function
// addUser();

// Start server
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
