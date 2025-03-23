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
    return c.json({ message: "Movie created successfully" }, 201);
  } catch (error) {
    console.error("Error creating movie:", error instanceof Error ? error.message : error);
    return c.json({ error: "Invalid movie data or server error" }, 400);
  }
});

app.patch("/movies/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) throw new Error("Invalid movie ID");

    const updatedFields: Partial<Movie> = await c.req.json();
    return mService.updateMovie(id, updatedFields)
      ? c.json({ message: "Movie updated successfully" })
      : c.json({ error: "Movie not found" }, 404);
  } catch (error) {
    console.error("Error updating movie:", error instanceof Error ? error.message : error);
    return c.json({ error: "Failed to update movie" }, 400);
  }
});

app.get("/movies/:id", (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) throw new Error("Invalid movie ID");

    const movie = mService.getMovie(id);
    return movie ? c.json(movie) : c.json({ error: "Movie not found" }, 404);
  } catch (error) {
    console.error("Error retrieving movie:", error instanceof Error ? error.message : error);
    return c.json({ error: "Failed to retrieve movie" }, 500);
  }
});

app.delete("/movies/:id", (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) throw new Error("Invalid movie ID");

    return mService.removeMovie(id)
      ? c.json({ message: "Movie deleted successfully" })
      : c.json({ error: "Movie not found" }, 404);
  } catch (error) {
    console.error("Error deleting movie:", error instanceof Error ? error.message : error);
    return c.json({ error: "Failed to delete movie" }, 500);
  }
});

app.post("/movies/:id/rate", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) throw new Error("Invalid movie ID");

    const { rating } = await c.req.json();
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      throw new Error("Invalid rating value, must be between 1 and 5");
    }

    const success = mService.rateMovie(id, rating);
    return success
      ? c.json({ message: "Rating added successfully" })
      : c.json({ error: "Movie not found or rating error" }, 400);
  } catch (error) {
    console.error("Error adding rating:", error instanceof Error ? error.message : error);
    return c.json({ error: "Failed to add rating" }, 400);
  }
});

console.log("Server started at http://localhost:3000");

serve(app);
