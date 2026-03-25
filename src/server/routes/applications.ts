import express from 'express';
import { Application } from '../models/Application.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all jobs applied by logged user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role === 'admin') {
      return res.status(403).json({ message: 'Admins do not have applied jobs' });
    }

    const applications = await Application.find({ user: req.user?.id })
      .populate('job')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
