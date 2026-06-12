const express = require("express");
const app = express();
app.use(express.json());

let movies = [
  { id: 1, movie: "dunne", zipCode: "0001" },
  { id: 2, movie: "dunne2", zipCode: "0002" },
  { id: 3, movie: "spider man", zipCode: "0003" },
  { id: 4, movie: "Doomsday", zipCode: "0004" },
  { id: 5, movie: "Suer man vs batman", zipCode: "0005" },
  { id: 6, movie: "The Witcher", zipCode: "0006" },
];

app.get("/api/movies", (req, res) => {
  res.json(movies);
});

app.get("/api/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  let movie = movies.find((singleMovie) => singleMovie.id === id);
  res.json(movie);
});

app.post("/api/search", (req, res) => {});

// async function getData() {
//   try {
//     const res = await fetch(`https://jsonplaceholder.typicode.com/posts/1`);
//     if (!res.ok) {
//       throw new Error(`HTTP error! Status: ${res.status}`);
//     }
//     const data = await res.json();
//   } catch (error) {
//     console.error("Failed to fetch data:", error);
//   }
// }
// getData();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening to http://localhost:${PORT}`);
});
