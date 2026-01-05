import { useEffect, useState, useRef, memo, useCallback } from "react";
import Navbar from "../components/NavBar/Navbar";
import MovieCarousel from "../components/Carousel/MovieCarousel";
import Footer from "../footer";
import Chatbot from "../components/Chatbot/Chatbot";

const API_URLS = [
  "https://foxmovies-backend.onrender.com/api/now_playing",
  "https://foxmovies-backend.onrender.com/api/popular",
  "https://foxmovies-backend.onrender.com/api/top_rated",
  "https://foxmovies-backend.onrender.com/api/upcoming",
];

const SECTIONS = [
  { id: "trending", label: "Trending", key: "trending" },
  { id: "top_rated", label: "Top Rated", key: "topRated" },
  { id: "popular", label: "Popular", key: "popular" },
  { id: "upcoming", label: "Upcoming", key: "upcoming" },
];

const initialMoviesState = {
  trending: [],
  popular: [],
  topRated: [],
  upcoming: [],
};

const initialLoadingState = {
  trending: true,
  popular: true,
  topRated: true,
  upcoming: true,
};

const initialRefsState = {
  trending: null,
  popular: null,
  topRated: null,
  upcoming: null,
};

function Home() {
  const [activeSection, setActiveSection] = useState("trending");
  const [movies, setMovies] = useState(initialMoviesState);
  const [loading, setLoading] = useState(initialLoadingState);
  const [error, setError] = useState(null);

  const refs = useRef(initialRefsState);

  // Memoized scroll function
  const scrollToSection = useCallback((sectionKey) => {
    refs.current[sectionKey]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Fetch movies with abort controller
  useEffect(() => {
    const controller = new AbortController();

    const fetchMovies = async () => {
      try {
        const results = await Promise.all(
          API_URLS.map((url) =>
            fetch(url, { signal: controller.signal }).then((res) => {
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              return res.json();
            })
          )
        );

        setMovies({
          trending: results[0].results || [],
          popular: results[1].results || [],
          topRated: results[2].results || [],
          upcoming: results[3].results || [],
        });

        setLoading({
          trending: false,
          popular: false,
          topRated: false,
          upcoming: false,
        });

        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to load movies:", err);
          setError("Failed to load movies. Please try again later.");
          setLoading({
            trending: false,
            popular: false,
            topRated: false,
            upcoming: false,
          });
        }
      }
    };

    fetchMovies();

    return () => controller.abort();
  }, []);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.9 }
    );

    SECTIONS.forEach((section) => {
      const element = refs.current[section.key];
      if (element) observer.observe(element);
    });

    return () => {
      SECTIONS.forEach((section) => {
        const element = refs.current[section.key];
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return (
    <>
      <Navbar scrollToSection={scrollToSection} activeSection={activeSection} />

      {error && (
        <div className="bg-red-500 text-white p-4 text-center sticky top-16 z-40">
          {error}
        </div>
      )}

      {SECTIONS.map((section) => (
        <div
          key={section.key}
          id={section.key}
          ref={(el) => (refs.current[section.key] = el)}
          className="scroll-mt-12 md:scroll-mt-24"
        >
          <MovieCarousel
            section={section.label}
            movies={movies[section.key]}
            loading={loading[section.key]}
          />
        </div>
      ))}
      <Footer />
      <Chatbot />
    </>
  );
}

export default memo(Home);
