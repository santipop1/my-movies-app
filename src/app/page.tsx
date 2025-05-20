"use client";

import React, { useEffect, useState } from "react";
import Carrusel from "@/components/Carrusel/Carrusel";
import { getUpcomingMovies, getGenres } from "@/services/movies/getMovies";
import { IMovieDetail } from "@/types/IMovieDetail";

export default function Home() {
  const [upcoming, setUpcoming] = useState<IMovieDetail[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const up = await getUpcomingMovies();
        setUpcoming(up.results || []);
        const g = await getGenres();
        setGenres(g.genres || []);
      } catch (e) {
        console.error("Error loading data: ", e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-2 text-blue-700 drop-shadow">
        🎬 My Movies App
      </h1>
      <p className="text-center text-lg text-gray-600 mb-8">
        Descubre los próximos estrenos y explora por género
      </p>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">
          Próximos Estrenos
        </h2>
        {loading ? (
          <div className="text-center text-gray-500">Cargando estrenos...</div>
        ) : (
          <Carrusel movies={upcoming} sourcePage="home-upcoming" />
        )}
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Géneros</h2>
        {loading ? (
          <div className="text-center text-gray-500">Cargando géneros...</div>
        ) : (
          <div className="flex flex-wrap gap-3 justify-center">
            {genres.map((genre) => (
              <span
                key={genre.id}
                className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold shadow hover:bg-blue-200 transition-colors cursor-pointer text-base"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}
      </section>
      <footer className="mt-16 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} My Movies App. Powered by TMDB.
      </footer>
    </div>
  );
}
