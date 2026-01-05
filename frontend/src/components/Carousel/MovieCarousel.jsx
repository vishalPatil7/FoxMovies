import { useRef, memo } from "react";

/* Skeleton Card Component */
const SkeletonCard = memo(() => (
  <div className="snap-start bg-white rounded-xl shadow-md overflow-hidden min-w-[45vw] sm:min-w-60 sm:max-w-60">
    <div className="w-full h-[50vw] sm:h-[330px] bg-gray-300 animate-ping"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-300 rounded animate-pulse w-2/4"></div>
    </div>
  </div>
));

/* Movie Card Component*/
const MovieCard = memo(({ movie }) => {
  return (
    <div className="snap-start bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform min-w-[45vw] sm:min-w-60 sm:max-w-60">
      <div className="w-full h-[50vw] sm:h-[330px]">
        <img
          src={`https://image.tmdb.org/t/p/original${movie?.poster_path}`}
          alt={movie?.title || "Movie Poster"}
          className="h-full w-full object-fit"
        />
      </div>
      <div className="p-3">
        <h2 className="font-semibold text-md sm:text-lg line-clamp-2 leading-tight">
          {movie?.title}
        </h2>
      </div>
    </div>
  );
});

/* Movie Carousel */
function MovieCarousel({ section, movies = [], loading }) {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -350, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 350, behavior: "smooth" });
  };

  return (
    <section className="w-full px-4 py-6 sm:px-6 sm:py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl sm:text-3xl font-bold">{section}</div>
        <div className="md:flex gap-3">
          <button
            onClick={scrollLeft}
            className="px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
          >
            ◀
          </button>
          <button
            onClick={scrollRight}
            className="px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
          >
            ▶
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
      >
        {loading &&
          Array.from({ length: 7 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}

        {movies.map((movie) => (
          <MovieCard key={movie?.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default memo(MovieCarousel);
