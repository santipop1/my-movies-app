"use client";
import React, { useEffect, useState } from "react";
import MovieList from "@/components/MovieList/MovieList";
import { getFavoriteMovies } from "@/services/accounts/getFavoriteMovies";
import { useGuestSession } from "@/providers/GuestSessionContext";
const MyFavoritesPage = () => {
  const { guestSessionId } = useGuestSession();
  const [loading, setLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [movies, setMovies] = useState<any[]>([]); // TODO: add proper typing later
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!guestSessionId) return;
      setLoading(true);
      try {
        const data = await getFavoriteMovies(guestSessionId, page);
        setMovies(data?.results || []);
        setTotalPages(data?.total_pages || 1);
      } catch (err) {
        console.error("Error loading favorite movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [guestSessionId, page]);

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
      <h3 className="text-3xl font-bold mb-6">My Favorite Movies</h3>
      {loading && (
        <h5 className="text-lg text-gray-500">Loading favorites...</h5>
      )}
      {!loading && movies.length === 0 && (
        <div className="text-center mt-10 text-gray-600">
          <p className="text-xl">You don’t have any favorite movies yet.</p>
          <p className="text-sm mt-2">
            Go to a movies detail page and click Add to Favorites to see it
            here.
          </p>
        </div>
      )}
      {!loading && movies.length > 0 && (
        <MovieList movies={movies} sourcePage="my-favorites" />
      )}
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
};
export default MyFavoritesPage;
