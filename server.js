const express = require('express');
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.static('public'));

// We need to use middleware functions everytime we create a server that's looking to accept POST data
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

const { database } = require('./db/db');

function filterByTitle(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title) {
      filteredResults = filteredResults.filter(note => note.title === query.title);
    }
    return filteredResults;
}

function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
  }


function createNewNote(body, notesArray) {
    const database = body;
    notesArray.push(database);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ database: notesArray }, null, 2)
      );
    return database;
  }

  function validateNewNote(newnote) {
    if (!newnote.title || typeof newnote.title !== 'string') {
      return false;
    }
    if (!newnote.text || typeof newnote.text !== 'string') {
      return false;
    }
    return true;
  }

app.get('/api/notes', (req, res) => {
    let results = database;
    if (req.query){
       results = filterByTitle(req.query, results);
    }
    res.json(results);
  });

  app.get('/api/notes/:id', (req, res) => {
        const result = findById(req.params.id, database);
        if (result) {
            res.json(result);
          } else {
            res.send(404);
          }
  });

app.post('/api/notes', (req, res)=>{
    // set id based on what the next index of the array will be
  req.body.id = database.length.toString();
  // if any data in req.body is incorrect, send 400 error back
  if (!validateNewNote(req.body)) {
    res.status(400).send('The note is not properly formatted.');
  } else {
  // add note to json file and database array in this function
  const newnote = createNewNote(req.body, database);

  res.json(newnote);
  }
});

// route to get index.html to be served from Express.js server

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

app.get('/notes', (req, res) => {
res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });