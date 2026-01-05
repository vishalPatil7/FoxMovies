import logo from "../../assets/logo.png";
import UserMenu from "../UserMenu/UserMenu";
import { memo, useCallback } from "react";

const NAVBAR_LINKS = [
  { label: "Trending", key: "trending" },
  { label: "Top Rated", key: "topRated" },
  { label: "Popular", key: "popular" },
  { label: "Upcoming", key: "upcoming" },
];

const NavLink = memo(({ link, isActive, scrollToSection }) => {
  const handleClick = useCallback(() => {
    scrollToSection(link.key);
  }, [link.key, scrollToSection]);

  return (
    <li>
      <button
        className={`px-4 py-2 rounded-full font-medium cursor-pointer transition-colors duration-200 ${
          isActive
            ? "bg-purple-100 text-purple-700"
            : "text-gray-700 hover:text-purple-700"
        }`}
        onClick={handleClick}
      >
        {link.label}
      </button>
    </li>
  );
});

export default function Navbar({ scrollToSection, activeSection }) {
  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between mx-3">
        {/* Logo */}
        <button
          onClick={() => scrollToSection("trending")}
          className="hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="Back to top"
        >
          <img src={logo} alt="logo" className="w-24 object-contain" />
        </button>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex gap-6 items-center">
          {NAVBAR_LINKS.map((link) => (
            <NavLink
              key={link.key}
              link={link}
              isActive={activeSection === link.key}
              scrollToSection={scrollToSection}
            />
          ))}
        </ul>

        {/* User Menu */}
        <div className="flex items-center pr-3">
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
