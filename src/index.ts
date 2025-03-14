import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { Movie, MoviesService } from "./movie";

const app = new Hono();
const mService = new MoviesService();

app.get("/movies", (c) => {
  return c.json({ message: "Hey! Welcome to the Movies API" });
});

app.post("/movies", async (c) => {
  try {
    const film: Movie = await c.req.json();
    mService.createMovie(film);
    return c.json({ message: "Movie created successfully" });
  } catch (e) {
    return c.json({ message: "Error creating movie" }, 400);
  }
});

app.patch("/movies/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const updatedFields: Partial<Movie> = await c.req.json();
  return mService.updateMovie(id, updatedFields)
    ? c.json({ message: "Movie updated successfully" })
    : c.json({ message: "Movie not found" }, 404);
});

app.get("/movies/:id", (c) => {
  const movie = mService.getMovie(parseInt(c.req.param("id")));
  return movie ? c.json(movie) : c.json({ message: "Movie not found" }, 404);
});

app.delete("/movies/:id", (c) => {
  return mService.removeMovie(parseInt(c.req.param("id")))
    ? c.json({ message: "Movie deleted successfully" })
    : c.json({ message: "Movie not found" }, 404);
});

app.post("/movies/:id/rate", async (c) => {
  const id = parseInt(c.req.param("id"));
  const { rating } = await c.req.json();
  const success = mService.rateMovie(id, rating);
  return success
    ? c.json({ message: "Rating added successfully" })
    : c.json({ message: "Error adding rating" }, 400);
});

console.log("Server started at http://localhost:3000");

serve(app);
