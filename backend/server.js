
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("iMovies backend is running!");
});

// Movie data
const movies = [
  {
    id: 1,
    title: "Interstellar",
    genre: "Sci-Fi · Adventure",
    rating: "8.7",
    price: 220
  },
  {
    id: 2,
    title: "Inception",
    genre: "Sci-Fi · Thriller",
    rating: "8.8",
    price: 200
  },
  {
    id: 3,
    title: "The Dark Knight",
    genre: "Action · Crime",
    rating: "9.0",
    price: 250
  },
  {
    id: 4,
    title: "Dune: Part Two",
    genre: "Sci-Fi · Action",
    rating: "8.5",
    price: 240
  }
];

// API route to get all movies
app.get("/api/movies", (req, res) => {
  res.json(movies);
});
app.get("/api/bookings", (req, res) => {
  res.json({ message: "Bookings route exists!" });
});

app.post("/api/bookings", (req, res) => {
  const { movie, date, time, seats, total } = req.body;

  if (!movie || !date || !time || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({
      message: "Please provide valid booking details.",
    });
  }

  res.status(201).json({
    message: "Booking received successfully!",
    booking: { movie, date, time, seats, total },
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
