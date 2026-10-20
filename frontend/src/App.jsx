
import { useState, useEffect } from "react";
import "./App.css";

const movies = [
  {
    id: 1,
    title: "Interstellar",
    genre: "Sci-Fi • Adventure",
    rating: "8.7",
    price: 220,
    poster:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    id: 2,
    title: "Inception",
    genre: "Sci-Fi • Thriller",
    rating: "8.8",
    price: 200,
    poster:
      "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  },
  {
    id: 3,
    title: "The Dark Knight",
    genre: "Action • Crime",
    rating: "9.0",
    price: 250,
    poster:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  },
  {
    id: 4,
    title: "Dune: Part Two",
    genre: "Sci-Fi • Action",
    rating: "8.5",
    price: 240,
    poster:
      "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
  },
];

const seatNumbers = Array.from({ length: 40 }, (_, i) => i + 1);
const bookedSeats = [3, 10, 17, 22, 29];

function App() {
  const [search, setSearch] = useState("");
  const [backendMovies, setBackendMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("6:30 PM");
  const [confirmation, setConfirmation] = useState(null);
  useEffect(() => {
  fetch("http://localhost:5000/api/movies")
    .then((response) => response.json())
    .then((data) => setBackendMovies(data))
    .catch((error) => console.error("Error fetching movies:", error));
}, []);
const filteredMovies = (backendMovies.length ? backendMovies : movies).filter((movie) =>
  movie.title.toLowerCase().includes(search.toLowerCase())
);
  

  function openBooking(movie) {
    setSelectedMovie(movie);
    setSelectedSeats([]);
    setSelectedDate("");
    setConfirmation(null);
  }

  function toggleSeat(seat) {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((previous) =>
      previous.includes(seat)
        ? previous.filter((number) => number !== seat)
        : [...previous, seat]
    );
  }

 
async function confirmBooking() {
  if (!selectedDate) {
    alert("Please choose a date first.");
    return;
  }

  if (selectedSeats.length === 0) {
    alert("Please select at least one seat.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movie: selectedMovie.title,
        date: selectedDate,
        time: selectedTime,
        seats: selectedSeats,
        total: selectedSeats.length * selectedMovie.price,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Booking failed");
    }

    setConfirmation({
      movie: data.booking.movie,
      date: data.booking.date,
      time: data.booking.time,
      seats: data.booking.seats,
      total: data.booking.total,
    });
  } catch (error) {
    alert(
      "Could not connect to the backend. Please check that it is running."
    );
    console.error(error);
  }
}


  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">iMovies</a>
        <nav>
          <a href="#home">Home</a>
          <a href="#movies">Movies</a>
          <a href="#about">About</a>
        </nav>
        <button
          className="primary-button"
          onClick={() => document.getElementById("movies")?.scrollIntoView()}
        >
          Book Tickets
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">YOUR NEXT MOVIE NIGHT STARTS HERE</p>
            <h1>Stories that<br />move you.</h1>
            <p className="hero-text">
              Discover great movies, find your perfect showtime,
              and make every seat the best seat in the house.
            </p>
            <a className="primary-button" href="#movies">
              Explore Movies ↗
            </a>
          </div>
          <div className="hero-art">
            <span className="film-icon">▶</span>
            <span className="hero-caption">YOUR SEAT IS WAITING</span>
          </div>
        </section>

        <section className="movies-section" id="movies">
          <div className="section-heading">
            <div>
              <p className="eyebrow">NOW SHOWING</p>
              <h2>Find your next favourite</h2>
            </div>
            <input
              className="search-box"
              type="search"
              placeholder="Search movies..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <article className="movie-card" key={movie.id}>
                <div className="poster-wrap">
                  <img
                    className="movie-poster"
                    src={movie.poster}
                    alt={movie.title}
                  />
                  <span className="rating">★ {movie.rating}</span>
                </div>
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.genre}</p>
                  <div className="movie-bottom">
                    <span>₹{movie.price} / ticket</span>
                    <button
                      className="book-button"
                      onClick={() => openBooking(movie)}
                    >
                      Book now
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredMovies.length === 0 && (
            <p className="empty-message">No movies found. Try another title.</p>
          )}
        </section>

        <section className="about-section" id="about">
          <p className="eyebrow">THE iMOVIES EXPERIENCE</p>
          <h2>Your next great story starts here.</h2>
          <p>
            Browse movies, choose a showtime, select your seats,
            and review your booking in one simple place.
          </p>
        </section>
      </main>

      <footer className="footer">
        <span>iMovies</span>
        <span>Made for movie lovers 🎬</span>
      </footer>

      {selectedMovie && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="booking-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setSelectedMovie(null)}
              aria-label="Close booking"
            >
              ×
            </button>

            {confirmation ? (
              <div className="confirmation">
                <p className="eyebrow">BOOKING SUMMARY</p>
                <h2>You're all set! 🎉</h2>
                <p><strong>Movie:</strong> {confirmation.movie}</p>
                <p><strong>Date:</strong> {confirmation.date}</p>
                <p><strong>Showtime:</strong> {confirmation.time}</p>
                <p><strong>Seats:</strong> {confirmation.seats.join(", ")}</p>
                <h3>Total: ₹{confirmation.total}</h3>
                <p className="demo-note">
                  Demo booking only. No payment was processed or booking saved
                  to a database.
                </p>
                <button
                  className="primary-button"
                  onClick={() => setSelectedMovie(null)}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <p className="eyebrow">YOUR MOVIE NIGHT</p>
                <h2>{selectedMovie.title}</h2>
                <p>{selectedMovie.genre}</p>

                <label htmlFor="show-date">Choose a date</label>
                <input
                  id="show-date"
                  type="date"
                  min={new Date().toLocaleDateString("en-CA")}
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />

                <label htmlFor="show-time">Choose a showtime</label>
                <select
                  id="show-time"
                  value={selectedTime}
                  onChange={(event) => setSelectedTime(event.target.value)}
                >
                  <option>10:00 AM</option>
                  <option>1:30 PM</option>
                  <option>6:30 PM</option>
                  <option>9:30 PM</option>
                </select>

                <p className="seat-label">Select your seats</p>
                <div className="screen-label">SCREEN</div>
                <div className="seat-grid">
                  {seatNumbers.map((seat) => {
                    const booked = bookedSeats.includes(seat);
                    const selected = selectedSeats.includes(seat);

                    return (
                      <button
                        key={seat}
                        className={`seat ${booked ? "booked" : ""} ${
                          selected ? "selected" : ""
                        }`}
                        disabled={booked}
                        onClick={() => toggleSeat(seat)}
                        aria-label={`Seat ${seat}${
                          booked ? ", unavailable" : ""
                        }`}
                      >
                        {seat}
                      </button>
                    );
                  })}
                </div>

                <div className="seat-legend">
                  <span>□ Available</span>
                  <span>■ Selected</span>
                  <span>× Booked</span>
                </div>

                <p className="total-price">
                  {selectedSeats.length} seat(s) · Total: ₹
                  {selectedSeats.length * selectedMovie.price}
                </p>

                <button
                  className="primary-button confirm-button"
                  onClick={confirmBooking}
                >
                  Confirm booking
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
