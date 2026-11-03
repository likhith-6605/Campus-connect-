
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const assignmentSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, default: 'Pending' }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

app.get('/', (req, res) => {
  res.send('Campus Connect API is running!');
});

app.get('/api/assignments', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/assignments', async (req, res) => {
  try {
    const newAssignment = await Assignment.create({
      subject: req.body.subject,
      title: req.body.title,
      status: 'Pending'
    });
    res.status(201).json(newAssignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/assignments/:id/submit', async (req, res) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status: 'Submitted' },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(updatedAssignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function startServer() {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is missing in Render Environment Variables');
    }

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB Atlas successfully!');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

startServer();
