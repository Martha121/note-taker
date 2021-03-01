const express = require('express');
const fs = require("fs");
const path = require("path");
const app = express();

// We need to use middleware functions everytime we create a server that's looking to accept POST data
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

const { database } = require('./Develop/db/db');

function filterByTitle(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title) {
      filteredResults = filteredResults.filter(note => note.title === query.title);
    }
    return filteredResults;
}

app.get('/api/notes', (req, res) => {
    let results = database;
    if (req.query){
       results = filterByTitle(req.query, results);
    }
    res.json(results);
  });

app.post('/api/notes', (req, res)=>{
    // req.body is where our incoming content will be
  console.log(req.body);
  res.json(req.body);
})

app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
  });
