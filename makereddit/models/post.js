const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  subject: String,
  body: String,
  // ref == reference to Room collection
  room: { type: Schema.Types.ObjectId, ref: 'Room' },
  points: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

module.exports = mongoose.model('Post', PostSchema);
