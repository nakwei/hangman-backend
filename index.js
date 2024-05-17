const express = require("express");
const app = express();
const port = 3000;

// GET  - Read a resource
// POST  - Create a resource from what I"m giving you and respond with a new resource
// PUT - Update with whole resource and respond with resource
// PATCH  - Partial Update and respond with resource
// DELETE - Delete a resource

// GET /my-page

// RESTful

app.post("/games", (req, res) => {
  // respond with a cookie that is an base64 encoded JSON string of the game
  // Cookie { word: "adfasdfds", id: 1 } -> ADSFASDFASDF)FASDLFASD
  return {
    id: 1,
    state: "playing",
    word: [],
    guesses: [],
  };
});

app.put("/games/:id", (req, res) => {
  // req.cookies["game"] -> decrypt ->  JSON.parse -> { word: "", guesses: [] }

  // req.body: ["a"]

  return {
    id: 1,
    state: "playing",
    word: ["a", null, null, "a"],
    guesses: ["a"],
  };

  // accepts whole game
  // but you would add some validation here to make sure the user isn't chaning the work

  // respond with a cookie that is an base64 encoded value of the word that they have
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// window.fetch for making api calls from the client to the api

// fetch("http://localhost:3000/games", {
