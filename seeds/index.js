const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(() => {
    console.log('MONGO CONNECTION OPEN');
})
.catch(err => {
    console.log('MONGO ERROR:')
    console.log(err);
});

// this function gets a random element from an array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// this function returns a Promise because it's async
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi doloribus consequatur quia quod quam, distinctio necessitatibus consectetur assumenda odit iure blanditiis dolore consequuntur suscipit ex in sunt voluptates commodi esse.',
            price
        })
        await camp.save();
    }
    console.log('Database seeded')
}

// returns a Promise, so we can use .then()
seedDB().then(() => {
    mongoose.connection.close();
    console.log('MONGO CONNECTION CLOSED')
});
