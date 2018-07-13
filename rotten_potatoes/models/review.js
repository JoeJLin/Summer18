const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 1
const ReviewSchema = new Schema({
    movieName: { type: String, required: true },
    rating: { type: Number, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true }
});

// 2
const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;