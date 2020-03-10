const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  content: { type: String },
  rating: { type: Number },
  author: { type: Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

module.exports = mongoose.model('Review', ReviewSchema);
