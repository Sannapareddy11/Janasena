const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    thumbnailImage: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to set publishedAt if status changes to published
newsSchema.pre('save', function () {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

const News = mongoose.model('News', newsSchema);
module.exports = News;
