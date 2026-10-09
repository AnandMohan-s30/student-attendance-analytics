require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const auth         = require('./middleware/auth');

const app = express();

// Allow the Vite dev server to send cookies cross-origin
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Public – auth endpoints (login / logout / me)
app.use('/api/auth', require('./routes/auth'));

// Protected – all application APIs require a valid JWT cookie
app.use('/api/students',  auth, require('./routes/students'));
app.use('/api/subjects',  auth, require('./routes/subjects'));
app.use('/api/attendance',auth, require('./routes/attendance'));
app.use('/api/analytics', auth, require('./routes/analytics'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
