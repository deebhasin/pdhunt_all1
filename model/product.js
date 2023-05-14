const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 200,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
    maxlength: 2000,
  },
  icon: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  shortDesc: {
    type: String,
    required: true,
    maxlength: 400,
  },
  images: {
    type: Array,
    default: [],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    immutable: true,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedOn: {
    type: Date,
    default: Date.now(),
  },
  tags: [String],
  upvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comment: [
    {
      _id: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
        maxlength: 2000,
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        immutable: true,
      },
      createdOn: {
        type: Date,
        default: Date.now(),
        immutable: true,
      },
    },
  ],
});

productSchema.methods.upvote = async function (userId) {
  if (this.upvotes.includes(userId)) {
    this.upvotes.pop(userId);
  } else {
    this.upvotes.push(userId);
  }
  await this.save();
};

productSchema.methods.addComment = async function (text, createdBy) {
  this.comment.push({
    _id: this.comment.length + 1,
    text,
    createdBy,
  });
  await this.save();
};

productSchema.methods.addTag = async function (tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
    await this.save();
  }
};

module.exports = mongoose.model("Product", productSchema);
