"use client";
import { useEffect, useState } from "react";
import { IMovieDetail } from "@/types/IMovieDetail";
import Image from "next/image";
import {
  getMovieById,
  getMovieRecommendationsById,
} from "@/services/movies/getMovieById";
import { markAsFavorite } from "@/services/accounts/markAsFavorite";
import { useGuestSession } from "@/providers/GuestSessionContext";
import { useParams } from "next/navigation";
import Carrusel from "@/components/Carrusel/Carrusel";

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<IMovieDetail>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { guestSessionId } = useGuestSession();
  const [movies, setMovies] = useState<IMovieDetail[]>([]);

  // Cargar detalles de la película
  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const data = await getMovieById(id);
        const data1 = await getMovieRecommendationsById(id);
        setMovie(data);
        setMovies(data1.results);
      } catch (err) {
        console.error("Error fetching movie", err);
        setError("Could not load movie.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);
  // Verificar si está en favoritos (localStorage)
  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const storedFavorites = localStorage.getItem("favoriteMovieIds");
    const favoriteIds: number[] = storedFavorites
      ? JSON.parse(storedFavorites)
      : [];
    setIsFavorite(favoriteIds.includes(Number(id)));
  }, [id]);
  // Marcar o desmarcar como favorito
  const handleToggleFavorite = async () => {
    if (!guestSessionId || !movie) return;
    const newFavoriteState = !isFavorite;
    try {
      await markAsFavorite(movie.id, newFavoriteState, guestSessionId);
      setIsFavorite(newFavoriteState);
      const storedFavorites = localStorage.getItem("favoriteMovieIds");
      const favoriteIds: number[] = storedFavorites
        ? JSON.parse(storedFavorites)
        : [];
      const updatedFavorites = newFavoriteState
        ? [...new Set([...favoriteIds, movie.id])]
        : favoriteIds.filter((id) => id !== movie.id);
      localStorage.setItem(
        "favoriteMovieIds",
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };
  if (loading) return <div>Loading movie...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>No movie found.</div>;
  return (
    <>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row gap-6">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-xl sm:w-64 h-auto object-contain"
            width={300}
            height={450}
          />
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <p className="italic text-slate-500">{movie.tagline}</p>
            <p>{movie.overview}</p>
            <div>
              <strong>Release:</strong> {movie.release_date.toString()}
            </div>
            <div>
              <strong>Genres:</strong>{" "}
              {movie.genres.map((g) => g.name).join(", ")}
            </div>
            <div>
              <strong>Rating:</strong> {movie.vote_average.toFixed(1)}
            </div>
            <strong>Production Companies:</strong>
            <div className="flex flex-wrap gap-4 mt-2">
              {movie.production_companies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center gap-2 bg-white/60 rounded p-2 shadow"
                >
                  {company.logo_path && (
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                      alt={company.name}
                      width={40}
                      height={40}
                      className="object-contain max-h-10 max-w-[60px]"
                    />
                  )}
                  <span className="text-xs font-semibold">{company.name}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleToggleFavorite}
              className={`px-4 py-2 rounded ${
                isFavorite
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
              } text-white font-bold w-max`}
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold mt-8">Recommendations</h2>
      <Carrusel movies={movies} sourcePage="movieDetail" />
    </>
  );
};
export default MovieDetailPage;
