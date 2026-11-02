import express from 'express';
import cors from 'cors';

import {
  errorHandler,
  ApiError,
  asyncHandler
} from './src/middlewares/index.js';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

let assignments = [
  {
    id: 1,
    subject: 'CS3301 - Full Stack',
    title: 'Lab 2: React Router',
    dueDate: '2026-10-05',
    status: 'Pending'
  },
  {
    id: 2,
    subject: 'CS3302 - DBMS',
    title: 'ER Diagram Project Report',
    dueDate: '2026-10-08',
    status: 'Pending'
  },
  {
    id: 3,
    subject: 'CS2225 - Data Science',
    title: 'Data Analysis Assignment',
    dueDate: '2026-10-10',
    status: 'Completed'
  }
];

app.get(
  '/api/assignments',
  asyncHandler(async (req, res) => {
    res.json(assignments);
  })
);

app.get(
  '/api/assignments/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);

    const assignment = assignments.find(
      (item) => item.id === id
    );

    if (!assignment) {
      throw new ApiError(404, 'Assignment not found');
    }

    res.json(assignment);
  })
);

app.post(
  '/api/assignments',
  asyncHandler(async (req, res) => {
    const {
      subject,
      title,
      dueDate,
      status
    } = req.body;

    if (!subject || !title) {
      throw new ApiError(
        400,
        'Subject and title are required'
      );
    }

    const newAssignment = {
      id: assignments.length + 1,
      subject,
      title,
      dueDate: dueDate || null,
      status: status || 'Pending',
      createdAt: new Date().toISOString()
    };

    assignments.push(newAssignment);

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      assignment: newAssignment
    });
  })
);

app.put(
  '/api/assignments/:id/submit',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);

    const assignment = assignments.find(
      (item) => item.id === id
    );

    if (!assignment) {
      throw new ApiError(404, 'Assignment not found');
    }

    assignment.status = 'Submitted';

    res.json({
      success: true,
      message: 'Assignment submitted successfully',
      assignment
    });
  })
);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Campus Connect Portal API is running!'
  });
});

app.use((req, res, next) => {
  next(
    new ApiError(
      404,
      `Route not found: ${req.originalUrl}`
    )
  );
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});