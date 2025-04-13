const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  content: { type: String, required: true },
  thumbnail: { type: String, required: true },
  category: { type: String, required: true },

  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  views: { type: Number, default: 0 } 
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);