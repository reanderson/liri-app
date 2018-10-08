// Initialize module requirements

require("dotenv").config();

const Spotify = require('node-spotify-api');
const request = require('request');
const moment = require('moment');
const fs = require('fs')

const keys = require("./keys.js");

const spotify = new Spotify(keys.spotify);

// get user input
let command = process.argv[2];
let searchTerm = process.argv[3];

// Liri can take four commands, so check the command to see if it is one of the acceptable ones:

if (command === "do-what-it-says") {
  // Checking for do what it says first and separately from the rest
  // retrieve the contents of random.txt, and set command and searchTerm accordingly.
  // then runLiri

} else {
  runLiri()
}

function runLiri() {
  // Check input for ohter commands
  if (command === "concert-this") {
    // search Bands in Town API
    // Print the name of venue, venue location, and date of event formatted as MM/DD/YYYY for all events returned
    // Expected searchTerm is the name of an artist

    if (searchTerm) {
      request(`https://rest.bandsintown.com/artists/${searchTerm}/events?app_id=codingbootcamp`, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

        
        const results = JSON.parse(body);

        if (!results[0]) {
          //If there's nothing to be found in the array, then state as such
          console.log(`No results found for ${searchTerm}`)
          return false;
        }

        console.log(`Results for ${searchTerm}:
        `)
        // the results come back as an array of objects, so loop through that array and print what we want
        results.forEach(function(result) {
          console.log(`Venue: ${result.venue.name}
Location: ${result.venue.city}, ${result.venue.region}, ${result.venue.country}
Date: ${moment(result.datetime, "YYYY-MM-DDTHH:mm:ss").format("MM/DD/YYYY")}
--------------------------------------------------`)
        })
      })
    } else {
      console.log("No artist entered")
    }
  } else if (command === "spotify-this-song") {
    // Search for a song name on the Spotify API
    // Print the artist, song title, preview link from Spotif, and album
    // If no song is provided, default to "The Sign" by Ace of Base
  } else if (command === "movie-this") {
    // Search OMDB api
    //Print movie title, year it came out, IMDB rating, Rotton Tomatoes rating, country where the movie was produced, the language, plot, and actors of the movie
    // If no movie is provided, default to the movie "Mr. Nobody"
  } else {
    // If none of the pre-programmed commands are inputted, print instructions
    console.log(`
    Welcome to Liri! Here's how to use this app:
    
    node liri.js concert-this "artist/band name"
      This will tell you where the chosen artist or band next has events.
      
    node liri.js spotify-this-song "song title"
      This will tell you information about the chosen song.
      
    node liri.js movie-this "movie title"
      This will tell you information about the chosen movie.
      
    node liri.js do-what-it-says
      This will execute the command in random.txt.`)
  }
}