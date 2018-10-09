// Initialize module requirements

require("dotenv").config();

const Spotify = require('node-spotify-api');
const request = require('request');
const moment = require('moment');
const fs = require('fs')

const keys = require("./keys.js");

const spotify = new Spotify(keys.spotify);

// get user input
let command = process.argv[2].toLowerCase();
let searchTerm = process.argv[3];

// Liri can take four commands, so check the command to see if it is one of the acceptable ones:

if (command === "do-what-it-says") {
  // Checking for do what it says first and separately from the rest
  // retrieve the contents of random.txt, and set command and searchTerm accordingly.
  // then runLiri

  fs.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
  
    // Then split data by commas
    var dataArr = data.split(",");
  
    // assign command and searchTerm

    command = dataArr[0];
    searchTerm = dataArr[1];

    //run liri
    runLiri()
  
  });

} else {
  runLiri()
}

function runLiri() {
  // Check input for other commands
  if (command === "concert-this") {
    // search Bands in Town API
    // Print the name of venue, venue location, and date of event formatted as MM/DD/YYYY for all events returned
    // Expected searchTerm is the name of an artist

    if (!searchTerm) {
      console.log("No search term found");
      return false;
    }

    request(`https://rest.bandsintown.com/artists/${searchTerm}/events?app_id=codingbootcamp`, function (error, response, body) {

      if (error) {
        console.log(`error: 
${error}`);
        return false;
      }
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received


      const results = JSON.parse(body);

      if (!results[0]) {
        //If there's nothing to be found in the array, then state as such
        console.log(`No results found for ${searchTerm}`)
        return false;
      }

      console.log(`Results for ${searchTerm}:
        `)
      // the results come back as an array of objects, so loop through that array and print what we want
      results.forEach(function (result) {
        console.log(`Venue: ${result.venue.name}
Location: ${result.venue.city}, ${result.venue.region}, ${result.venue.country}
Date: ${moment(result.datetime, "YYYY-MM-DDTHH:mm:ss").format("MM/DD/YYYY")}
--------------------------------------------------`)
      })
    })
  } else if (command === "spotify-this-song") {
    // Search for a song name on the Spotify API
    // Print the artist, song title, preview link from Spotif, and album
    // If no song is provided, default to "The Sign" by Ace of Base
    if (!searchTerm) {
      searchTerm = "The Sign Ace of Base"
    }

    spotify
      .search({
        type: 'track',
        query: searchTerm
      })
      .then(function (response) {
        const responseItems = response.tracks.items;

        if (!responseItems[0]) {
          // If there aren't any items found,
          console.log(`No results for ${searchTerm}`)
          return false;
        }


        console.log(`Results for ${searchTerm}:
    `)

        responseItems.forEach(function (song) {
          let artist = song.artists[0].name;

          if (song.artists.length > 0) {
            for (let i = 1; i < song.artists.length; i++) {
              artist = `${artist}, ${song.artists[i].name}`
            }
          }

          const songTitle = song.name;
          const prevLink = song.preview_url;
          const songAlbum = song.album.name;

          console.log(`Title: ${songTitle}
Artist: ${artist}
Album: ${songAlbum}
Preview: ${prevLink}
--------------------------------------------------`)
        })
      })
      .catch(function (err) {
        console.log(err);
      });

  } else if (command === "movie-this") {
    // Search OMDB api
    //Print movie title, year it came out, IMDB rating, Rotton Tomatoes rating, country where the movie was produced, the language, plot, and actors of the movie
    // If no movie is provided, default to the movie "Mr. Nobody"

    if (!searchTerm) {
      searchTerm = "Mr. Nobody"
    }

    request(`http://www.omdbapi.com/?apikey=trilogy&t=${searchTerm}`, function (error, response, body) {
      if (error) {
        console.log(`Error:
  ${error}`)
        return false;
      }
      const parsedBody = JSON.parse(body)

      if (parsedBody.Response === "False") {
        console.log(`No Results for ${searchTerm}`);
        return false;
      }

      const title = parsedBody.Title;
      const year = parsedBody.Year;
      const country = parsedBody.Country;
      const language = parsedBody.Language;
      const plot = parsedBody.Plot;
      const actors = parsedBody.Actors;

      let ratings = ""
      parsedBody.Ratings.forEach(function (rating) {
        ratings += `${rating.Source} Rating: ${rating.Value}
`
      })
      
      console.log(`Result for ${searchTerm}:
      
Title: ${title}
Year of Release: ${year}
Actors: ${actors}
Country of Production: ${country}
Language: ${language}
${ratings}Plot: ${plot}`)

    })

  } else if (command === "help") {
    // provide instructions if help command is entered
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
  } else {
    // if no correct command is given, say as such
    console.log(`Invalid command. See the readme, or enter 
node liri.js help
for a list of valid commands.`)
  }
}