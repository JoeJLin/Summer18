const express = require('express');

const router = express.Router();

const auth = require('./helpers/auth');
const Room = require('../models/room');
const postRouter = require('./posts');
const Post = require('../models/post');

router.use('/:roomId/posts', postRouter);

// Rooms index
router.get('/', (req, res) => {
// find{} == a method to find a particular document or documents
// in this case find all the 'topic' in the room collection
  Room.find({}, 'topic', (err, rooms) => {
    if (err) {
      console.error(err);
    } else {
      res.render('rooms/index', { rooms });
    }
  });
});

// GO TO the url for creating a new topic (NOT CREATE A NEW TOPIC)
router.get('/new', auth.requireLogin, (req, res) => {
    res.render('rooms/new');
});

// Go to an edit page for a specific topic
router.get('/:id/edit', auth.requireLogin, (req, res, next) => {
    // Find the specific topic by its ID
    // room = the result of findById
    Room.findById(req.params.id, function (err, room) {
        if (err) { console.error(err) };
        // pass the room (result) to rooms/edit
        res.render('rooms/edit', { room });
    });
});

// post an change of the topic
router.post('/:id', auth.requireLogin, (req, res, next) => {
    // find the topic by id 
    // req.body = request body (the body of rooms/edit.hbs)
    Room.findByIdAndUpdate(req.params.id, req.body, function (err, room) {
        if (err) { console.error(err) };
        console.log('topic updated');
        res.redirect('/rooms/' + req.params.id);
    });
});

//post a new topic 
// '/' = '/rooms'
// post an action in rooms/new.hbs
router.post('/', auth.requireLogin, (req, res, next) => {
    // assign room to what we got back from the req.body
    let room = new Room(req.body);

    // save it to the database
    room.save(function(err, room) {
        if(err) { console.log(err) };
        // redirect to rooms which will display a whole list of topics
        return res.redirect('/rooms');
    });
});

// go to a specific topic page which will display topics and posts
router.get('/:id', auth.requireLogin, (req, res, next) => {
    Room.findById(req.params.id, function (err, room) {
        if (err) { console.error(err) };
        // .populate == Population is the process of automatically replacing the 
        //specified paths in the document with document(s) from other collection(s)
        // Post.find the id of the room and also find comments
        Post.find({ room: room }).populate('comments').exec(function (err, posts) {
            if (err) { console.error(err) };

            // sort posts
            posts = posts.sort({points: -1 });
            // posts = posts.sort((post1, post2) => { return post2.points - post1.points})

            res.render('rooms/show', { room, posts });
        });
    });
});



module.exports = router;