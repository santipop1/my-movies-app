import Link from "next/link";
import { IMovieDetail } from "@/types/IMovieDetail";
import Config from "@/config";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface IMovieListProps {
  movies: IMovieDetail[];
  sourcePage: string;
}

const Carrusel: React.FC<IMovieListProps> = ({ movies, sourcePage }) => {
  const [centerIndex, setCenterIndex] = useState(2);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const AUTO_TIME = 6000;

  // Función para iniciar el intervalo
  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCenterIndex((prev) => (prev + 1) % movies.length);
    }, AUTO_TIME);
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [movies.length]);

  const handlePrev = () => {
    setCenterIndex((prev) => (prev - 1 + movies.length) % movies.length);
    startAutoSlide(); // Reinicia el temporizador
  };
  const handleNext = () => {
    setCenterIndex((prev) => (prev + 1) % movies.length);
    startAutoSlide(); // Reinicia el temporizador
  };

  if (movies.length === 0) return null;

  // Calcular los índices de las 5 películas a mostrar
  const getVisibleMovies = () => {
    const result = [];
    for (let i = -2; i <= 2; i++) {
      const idx = (centerIndex + i + movies.length) % movies.length;
      result.push({ ...movies[idx], pos: i });
    }
    return result;
  };

  const visibleMovies = getVisibleMovies();

  return (
    <div className="relative group flex justify-center items-center gap-6 w-full overflow-x-hidden px-4 py-8 md:py-12" style={{boxSizing: 'border-box'}}>
      {/* Botón izquierdo */}
      <button
        aria-label="Anterior"
        onClick={handlePrev}
        className="absolute left-2 md:left-4 z-20 bg-white/70 hover:bg-white/90 text-gray-700 rounded-full shadow p-2 transition-opacity opacity-80 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
      </button>
      {/* Carrusel de películas */}
      {visibleMovies.map((movie) => {
        let scale = 1;
        const zIndex = 10 - Math.abs(movie.pos);
        let opacity = 1;
        let translateY = "0px";
        // Hacer la imagen más grande
        const maxWidth = 320;
        const minWidth = 0;
        const imageWidth = 320;
        const imageHeight = 440;
        if (movie.pos === 0) {
          scale = 1.15;
          translateY = "-20px";
        } else if (Math.abs(movie.pos) === 1) {
          scale = 0.95;
          opacity = 0.85;
        } else {
          scale = 0.8;
          opacity = 0.6;
        }
        const poster = Config.IMAGE_SOURCE + movie.poster_path;
        return (
          <div
            key={movie.id}
            style={{
              transform: `scale(${scale}) translateY(${translateY})`,
              zIndex,
              opacity,
              transition: "all 0.4s cubic-bezier(.4,2,.6,1)",
              minWidth,
              maxWidth,
            }}
            className="flex-shrink-0 bg-gray-900 border border-gray-800 rounded-2xl shadow-lg"
          >
            <Link
              href={{
                pathname: `/movie/${movie.id}`,
                query: { from: sourcePage },
              }}
            >
              <div className="flex flex-col items-center">
                <Image
                  src={poster}
                  width={imageWidth}
                  height={imageHeight}
                  className="rounded-xl object-cover border border-gray-800"
                  alt={movie.title}
                />
                <div className="mt-2 text-center w-full">
                  <span className="block font-semibold text-base md:text-lg line-clamp-1 text-gray-100">
                    {movie.title}
                  </span>
                  <span className="block text-blue-300 text-sm md:text-base">
                    ({new Date(movie.release_date).getFullYear()})
                  </span>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
      {/* Botón derecho */}
      <button
        aria-label="Siguiente"
        onClick={handleNext}
        className="absolute right-2 md:right-4 z-20 bg-white/70 hover:bg-white/90 text-gray-700 rounded-full shadow p-2 transition-opacity opacity-80 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>
  );
};

export default Carrusel;
