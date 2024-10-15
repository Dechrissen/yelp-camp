const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const ExpressErroe = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const {campgroundSchema} = require('./schemas')

// connect to mongo
mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(() => {
    console.log('MONGO CONNECTION OPEN');
})
.catch(err => {
    console.log('MONGO ERROR:')
    console.log(err);
});

//
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// to use ejs-mate as the interpreter for EJS
app.engine('ejs', ejsMate);

// Middleware.
app.use(express.urlencoded({ extended: true })); // this is for parsing the request body on POST requests
app.use(methodOverride('_method')); // this is for using more HTTP verbs, like PUT PATCH DELETE. the 'method' in an HTML form will be overridden

const validateCampground = (req,res,next) => {
    // Validation //
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(elem => elem.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
    //console.log(result);
}

app.get('/', (req,res) => {
    res.render('home.ejs');
});

// GET for index page, showing all campgrounds
app.get('/campgrounds', async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds });
})

// GET for submission page for adding a new campground
app.get('/campgrounds/new', (req,res) => {
    res.render('campgrounds/new.ejs');
})

// POST for adding a new campground to the db from the new campground form
app.post('/campgrounds', validateCampground, catchAsync(async (req,res,next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

// GET for show page, showing details for one campground by id
app.get('/campgrounds/:id', catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show.ejs', { campground });
}));

// GET for the edit form for editing a campground
app.get('/campgrounds/:id/edit', catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit.ejs', { campground });
}));

// PUT for updating the campground in the db from the edit form
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req,res) => {
    const { id } = req.params;
    
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        // spread operator, spreading the object into the object needed for the arg
        // we can access 'campground' object from the req body because in the 'name' field in the edit.ejs form, we structured it
        // with name="campground[title]" and name="campground[location]" etc.
        // this automatically puts the data into the 'campground' object so we can use it here

    res.redirect(`/campgrounds/${campground._id}`);
}));

// DELETE for deleting a campground from the show page
app.delete('/campgrounds/:id', catchAsync(async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

// 404
app.all('*', (req,res,next) => {
    next(new ExpressError('Page not found!!!', 404));
        // this passes a new ExpressError to the error handler app.use(), where we will have access to it
        // including `statusCode` and `message`
})

// Error handler
app.use((err, req, res, next) => {
    const {statusCode=500} = err; // destructuring the ExpressError from the 404 handler above
    if (!err.message) err.message = 'Oh no, something went wrong';
    res.status(statusCode).render('error', { err });
})


app.listen(3000, () => {
    console.log('Serving on port 3000 ...');
})