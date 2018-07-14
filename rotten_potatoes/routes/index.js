var express = require('express');
var router = express.Router();
const request = require('request');
const cron = require('cron');

const Review = require('../models/review');
const Movie = require('../models/movie');



const checkMovie = new cron.CronJob({
  //it will trigger every 20 minutes
  cronTime: '* */20 * * * *',
  onTick: function () {

    const url = "https://itunes.apple.com/us/rss/topmovies/limit=25/json";
    request.get(url, (err, response, body) => {
      if (err) {
        console.log(err)
      }
      body = JSON.parse(body);

      Movie.collection.drop();

      const movies = [];
      //loop through the api body
      body.feed.entry.forEach(function (data) {

        movies.push(new Movie({
          name: data['im:name'].label,
          image: data['im:image'][2].label,
          summary: data.summary.label,
          title: data.title.label,
          duration: data.link[1]['im:duration'].label,
          category: data.category.attributes.label,
        }).save(function (err) {
          // if (err) console.log(data['im:name'].label + ' --- Error or already saved');
          if (err) console.log(err);
          else { console.log('SUCCESSFUL') }
        }));
      });
    });

  }
});

checkMovie.start();


/* GET home page. */
// '/' is the URL path that will determine if the callback in the function's second argument will be executed.
// the 'index' specifies that name of the Handlebars template in the view folder
router.get('/', (req, res) => {
    // [Movie, Movie, Movie...]
    // Promise.all(movies).then((movies) => {
    //   // render or redirect or...
    //   console.log('saved!!!!')
    // }).catch((err) => {
    //   // console.log()
    //   console.log('error!!')
    // })


  Movie.find({}, (err, movies) => {
    if(err) {console.log(err) }
    res.render('movies/', { movies: movies });
  })
  //find the reviews
  // Review.find({}, (err, reviews) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   //render all the reviews
  //   res.render('reviews/index', {
  //     reviews: reviews
  //   });
  // });

});

//render the review form
router.get('/reviews/new', (req, res) => {
  res.render('reviews/new');
});

//post the review form to the database
router.post('/reviews', (req, res) => {
  //
  const review = new Review(req.body);

  // save the review to the database, if encounter error, display err message in console
  review.save(function (err, review) {
    if (err) {
      console.log(err);
    }

    // if given no errors, redirect(display) your review
    return res.redirect('/reviews/' + review._id);
  });
});

//  :id This ID corresponds to the Id of the review we want to display.
// router.get('/reviews/:id', (req, res) => { 
//   //  use the .findById method to query the database for a record with the given Id.
//   Review.findById(req.params.id, (err, review) => {
//     if (err) {
//       console.log(err);
//     }

//     // 3
//     res.render('reviews/show', {
//       review: review
//     });
//   });
// });


router.get('/movies/:id', (req, res) =>{
  Movie.findById(req.params.id, (err, movie) =>{
    if(err) console.log(err)
    res.render('movies/show', {movie})
  })
})

// Helper Function


module.exports = router;
