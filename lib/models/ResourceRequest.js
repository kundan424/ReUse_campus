import mongoose from 'mongoose';

const ResourceRequestSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
      index: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    requestedQuantity: {
      type: Number,
      required: true,
      min: [1, 'Must request at least 1 unit'],
      validate: {
        validator: Number.isInteger,
        message: 'Requested quantity must be an integer',
      },
    },
    purpose: {
      type: String,
      required: [true, 'Please explain your reason or intended reuse purpose'],
      trim: true,
      maxlength: [1000, 'Purpose cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'ready_for_pickup', 'completed'],
      default: 'pending',
      index: true,
    },
    decisionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    decisionNote: {
      type: String,
      trim: true,
      default: '',
    },
    decisionAt: {
      type: Date,
      default: null,
    },
    pickupScheduledAt: {
      type: Date,
      default: null,
    },
    pickupNotes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ResourceRequest || mongoose.model('ResourceRequest', ResourceRequestSchema);
