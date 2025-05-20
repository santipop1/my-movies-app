"use client";
import React, { useEffect, useState } from "react";
import { getNowPlayingMovies } from "@/services/movies/getMovies";
import { IMovieDetail } from "@/types/IMovieDetail";
import MovieList from "@/components/MovieList/MovieList"; // Importar MovieList


const NowPlaying = () => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<IMovieDetail[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      setLoading(true);
      try {
        const data = await getNowPlayingMovies(page);
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (err) {
        console.error("Error loading movies: ", err);
      }
      setLoading(false);
    };
    fetchNowPlayingMovies();
  }, [page]);

  // Calcular el rango de páginas a mostrar
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);
    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(totalPages, start + 4);
      } else if (end === totalPages) {
        start = Math.max(1, end - 4);
      }
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };
  const pageNumbers = getPageNumbers();

  return (
    <div>
      <h3 className="text-3xl font-bold mb-6">Now Playing Movies</h3>
      {/* Loading indicator */}
      {loading && <h5 className="text-lg text-gray-500">Cargando...</h5>}
      {/* Movie List Component */}
      {!loading && movies.length > 0 && <MovieList movies={movies} sourcePage="now-playing" />}
      {/* Paginación */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 hover:bg-blue-900 hover:text-blue-300 disabled:opacity-50 transition-colors shadow"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Atrás
        </button>
        {pageNumbers.map((num) => (
          <button
            key={num}
            className={`px-3 py-2 rounded font-semibold border transition-colors shadow ${
              num === page
                ? "bg-blue-700 text-white border-blue-500" 
                : "bg-gray-900 text-gray-200 border-gray-700 hover:bg-blue-900 hover:text-blue-300"
            }`}
            onClick={() => setPage(num)}
            disabled={num === page}
          >
            {num}
          </button>
        ))}
        <button
          className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 hover:bg-blue-900 hover:text-blue-300 disabled:opacity-50 transition-colors shadow"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Adelante
        </button>
      </div>
    </div>
  );
}
export default NowPlaying;