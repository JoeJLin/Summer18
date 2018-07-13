const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    name: { type: String, required: true},
    image: { type: String, required: true},
    summary: { type: String, required: true},
    title: { type: String, required: true},
    duration: { type: String, required: true},
    category: { type: String, required: true}
});

MovieSchema.pre('save', function(next) {
    const movie = this;
    Movie.findOne({ name: this.name }, function (err, result) {
        if (err) return next(err);
        else if (result) {
            // console.log('movie name already exists');
            return next(new Error(result.name + 'movie name must be unique or already exists'));
        } else {
            return next();
        }
    })
})

const Movie = mongoose.model('Movie', MovieSchema);
module.exports = Movie;