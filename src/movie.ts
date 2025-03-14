export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  genre: string;
  rating: number[];
}

export class MoviesService {
  private movies: Movie[] = [];

  createMovie(movie: Movie): void {
    if (
      !movie.id ||
      !movie.title ||
      !movie.year ||
      !movie.director ||
      !movie.genre
    ) {
      throw new Error("All fields are required");
    }
    this.movies.push(movie);
  }

  updateMovie(id: number, updatedFields: Partial<Movie>): boolean {
    const movie = this.movies.find((movie) => movie.id === id);
    if (!movie) {
      return false;
    }
    Object.assign(movie, updatedFields);
    return true;
  }

  getMovie(id: number): Movie | undefined {
    return this.movies.find((movie) => movie.id === id);
  }

  removeMovie(id: number): boolean {
    const index = this.movies.findIndex((movie) => movie.id === id);
    if (index === -1) {
      return false;
    }
    this.movies.splice(index, 1);
    return true;
  }

  rateMovie(id: number, rating: number): boolean {
    const movie = this.getMovie(id);
    if (!movie) {
      console.log("Movie not found");
      return false;
    }
    if (rating < 1 || rating > 5) {
      console.log("Invalid rating");
      return false;
    }
    movie.rating.push(rating);
    return true;
  }

  getMoviesByRating(rating: number): Movie[] {
    return this.movies.filter((movie) => movie.rating.includes(rating));
  }

  getAverageRating(id: number): number | null {
    const movie = this.getMovie(id);
    if (!movie || movie.rating.length === 0) {
      return null;
    }
    const total = movie.rating.reduce((acc, curr) => acc + curr, 0);
    return total / movie.rating.length;
  }

  getTopRatedMovies(): Movie[] {
    return this.movies
      .filter((movie) => movie.rating.length > 0)
      .sort(
        (a, b) =>
          (this.getAverageRating(b.id) || 0) -
          (this.getAverageRating(a.id) || 0)
      );
  }

  getMoviesByGenre(genre: string): Movie[] {
    return this.movies.filter((movie) => movie.genre === genre);
  }

  getMoviesByDirector(director: string): Movie[] {
    return this.movies.filter((movie) => movie.director === director);
  }

  searchMoviesByTitle(title: string): Movie[] {
    return this.movies.filter((movie) =>
      movie.title.toLowerCase().includes(title.toLowerCase())
    );
  }
}
