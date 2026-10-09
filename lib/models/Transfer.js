import mongoose from 'mongoose';

const TransferSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
      index: true,
    },
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResourceRequest',
      required: true,
      unique: true,
      index: true,
    },
    giver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    quantityTransferred: {
      type: Number,
      required: true,
      min: 1,
    },
    giverConfirmedAt: {
      type: Date,
      default: null,
    },
    receiverConfirmedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'disputed'],
      default: 'in_progress',
      index: true,
    },
    impact: {
      estimatedSavingsINR: {
        type: Number,
        default: 0,
      },
      estimatedCarbonSavedKg: {
        type: Number,
        default: 0,
      },
      wasteDivertedKg: {
        type: Number,
        default: 0,
      },
    },
    impactMethodVersion: {
      type: String,
      default: 'v1.0-benchmark',
    },
    disputeReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Transfer || mongoose.model('Transfer', TransferSchema);
