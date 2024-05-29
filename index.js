const express = require("express");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const cors = require("cors"); 
const app = express();
const port = 3005;
const bodyparser = require("body-parser")

// app.use(cors()); // Use the cors middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true}));
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json())

// GET  - Read a resource
// POST  - Create a resource from what I"m giving you and respond with a new resource
// PUT - Update with whole resource and respond with resource
// PATCH  - Partial Update and respond with resource
// DELETE - Delete a resource

// GET /my-page

// RESTful

// const secret = "trailhead";
const secret = "6f5cd9af4b2873a509d2e167e6b52f3bc9f7e3ba2a478e916fe68d84a1d5f9ab";
console.log(Buffer.from(secret, 'hex').length); 
const words = [
  "car",
  "tree",
  "bush",
  "hello",
  "apple",
  "stations",
  "taxi",
  "constellation",
  "telescope",
  "pants",
  "eyeball",
  "sandwich",
  "shoes",
  "market",
  "phone",
  "camera",
  "chair",
  "backyard",
  "cat",
  "sea",
];

const getRandomIndex = (arr) => {
  return Math.round(Math.random() * arr.length);
};

function encrypt(text) {
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secret, "hex"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

  const findWrongGuesses = (word, guessed) => {
    return guessed.filter(
      (char) => !word.includes(char.toLowerCase()));
  };


function decrypt(text) {
  const [ivHex, encrypted] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secret, "hex"),
    iv
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}




app.post("/games", (req, res) => {
  // respond with a cookie that is an base64 encoded JSON string of the game
  // Cookie { word: "adfasdfds", guesses } -> ADSFASDFASDF)FASDLFASD

  
  if (req.cookies["game"]) { //changed from res to req
    res.cookie("game", req.cookies["game"], { //changed from res to req

      maxAge: 300000, // Cookie expiration time in milliseconds
      httpOnly: true, // Cookie is accessible only by the web server
    });

    const cookieValue = JSON.parse(decrypt(req.cookies["game"])); //changed from res to req
    console.log(cookieValue)
    return res.json({
      word: cookieValue.word
        .split("")
        .map((letter) => (cookieValue.guesses.includes(letter) ? letter : null)),
      guesses: cookieValue.guesses,
    });
  }

  const word = words[getRandomIndex(words)];
  const json = JSON.stringify({ word, guesses: [] });

  res.cookie("game", encrypt(json), {
    maxAge: 300000, // Cookie expiration time in milliseconds
    httpOnly: true, // Cookie is accessible only by the web server
  });

  res.json({ word: word.split("").map(() => null), guesses: [] });
});

// when user makes any guesses
// using put, because we are updating the "game" rescource
app.put("/games/guesses", (req, res) => {
  

  const updatedGuesses = req.body
  const cookieValue = JSON.parse(decrypt(req.cookies["game"]))
  const word = cookieValue.word


  const json = JSON.stringify({ word, guesses: updatedGuesses});


  res.cookie("game", encrypt(json), {
    maxAge: 300000,
    httpOnly: true,
  });

  return res.json({
    word: cookieValue.word
      .split("")
      .map((letter) => (updatedGuesses.includes(letter) ? letter : null)),
    guesses: {updatedGuesses},
    });
  });

app.put("/games/restart", (req, res) => {
  const cookieValue = JSON.parse(decrypt(req.cookies["game"]))
  const word = cookieValue.word

  const nextwordbank = [...words].filter((item) => item!==word)

  const newword = nextwordbank[getRandomIndex(nextwordbank)];
  const json = JSON.stringify({word: newword, guesses: [] });

  res.cookie("game", encrypt(json), {
    maxAge: 300000, // Cookie expiration time in milliseconds
    httpOnly: true, // Cookie is accessible only by the web server
  });

  res.json({ word: newword.split("").map(() => null), guesses: [] });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// window.fetch for making api calls from the client to the api

// fetch("http://localhost:3000/games", {

// Add support for
// - making guesses
// - updating local
