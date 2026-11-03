import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/campus_connect';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) =>
    console.error('❌ MongoDB Connection Error:', err)
  );

// Assignment Schema
const assignmentSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Pending'
  }
});

const Assignment = mongoose.model(
  'Assignment',
  assignmentSchema
);

// GET: Fetch all assignments
app.get('/api/assignments', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Create a new assignment
app.post('/api/assignments', async (req, res) => {
  try {
    const { subject, title } = req.body;

    if (!subject || !title) {
      return res.status(400).json({
        message: 'Subject and title are required'
      });
    }

    const newAssignment = await Assignment.create({
      subject,
      title,
      status: 'Pending'
    });

    res.status(201).json(newAssignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Submit an assignment
app.put('/api/assignments/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid assignment ID'
      });
    }

    const updatedAssignment =
      await Assignment.findByIdAndUpdate(
        id,
        { status: 'Submitted' },
        { new: true, runValidators: true }
      );

    if (!updatedAssignment) {
      return res.status(404).json({
        message: 'Assignment not found'
      });
    }

    res.json(updatedAssignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server after MongoDB connects
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(
      `🚀 Server running on http://localhost:${PORT}`
    );
  });
});
