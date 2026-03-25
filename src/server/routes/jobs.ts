import express from 'express';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all jobs (for users & admins)
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { companyName, location, type } = req.query;
    let query: any = {};

    if (companyName) {
      query.companyName = { $regex: companyName, $options: 'i' };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (type) {
      query.type = type;
    }

    // Admins see only their posted jobs
    if (req.user?.role === 'admin') {
      query.postedBy = req.user.id;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new job (admin only)
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { companyName, position, type, location } = req.body;
    
    const job = new Job({
      companyName,
      position,
      type,
      location,
      postedBy: req.user?.id
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a job (admin only)
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { companyName, position, type, location } = req.body;
    
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user?.id },
      { companyName, position, type, location },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a job (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user?.id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    // Delete associated applications
    await Application.deleteMany({ job: req.params.id });

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply to a job (user only)
router.post('/:id/apply', authenticate, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot apply to jobs' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({ user: req.user?.id, job: req.params.id });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = new Application({
      user: req.user?.id,
      job: req.params.id
    });

    await application.save();
    res.status(201).json({ message: 'Applied successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
