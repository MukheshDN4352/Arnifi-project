import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  position: { type: String, required: true },
  type: { type: String, required: true, enum: ['Full Time', 'Part Time', 'Contract', 'Internship'] },
  location: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const Job = mongoose.model('Job', jobSchema);
