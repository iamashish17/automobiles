import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Show, UserButton } from "@clerk/react";
import { useAuth } from "../../context/useAuth";
import newpurnagiri from "../../assets/logos/newpurnagiri.png"

const navItems = [
  { to: "/", label: "Home" },
  { to: "/parts", label: "Parts" },
  { to: "/services", label: "Services" },
  { to: "/service-booking", label: "Service Booking" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

const navClass = ({ isActive }) =>
  `font-medium transition-colors duration-200 ${
    isActive ? "text-black" : "text-gray-500 hover:text-black"
  }`;

const Navbar = () => {
  const { isAuthenticated, isAuthLoading, user, logout, authMethod } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = String(user?.role || "").toLowerCase() === "admin";
  const visibleNavItems = isAdmin
    ? [...navItems, { to: "/admin-dashboard", label: "Admin Dashboard" }]
    : navItems;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-3 sm:px-6 lg:gap-6">
        <Link to="/" onClick={closeMenu} className="min-w-0 text-sm font-semibold text-gray-900 sm:text-base">
          <img
      src={newpurnagiri}
      alt="New Purnagiri"
      className="h-14 w-auto"
    />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm">
          {visibleNavItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <Link
                  to="/admin-dashboard"
                  className="px-4 py-2 rounded-md bg-slate-950 text-sm font-medium text-white hover:bg-slate-800 transition-colors duration-200"
                >
                  Admin
                </Link>
              ) : null}
              {!isAdmin ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-md bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                >
                  Dashboard
                </Link>
              ) : null}
              {authMethod === "clerk" ? (
                <Show when="signed-in">
                  <UserButton afterSignOutUrl="/" />
                </Show>
              ) : (
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 rounded-md bg-gray-100 text-sm font-medium text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                >
                  Logout
                </button>
              )}
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="px-4 py-2 rounded-md bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 rounded-md bg-gray-100 text-sm font-medium text-gray-800 hover:bg-gray-200 transition-colors duration-200"
              >
                Login
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="lg:hidden rounded-md border border-gray-200 p-2 text-gray-700"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen ? (
        <div className="lg:hidden border-t border-gray-100 px-4 py-4 sm:px-6">
          <nav className="flex flex-col gap-3 text-sm">
            {visibleNavItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={closeMenu} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
            {isAuthLoading ? (
              <p className="text-sm text-gray-500">Checking login...</p>
            ) : isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Link onClick={closeMenu} to="/admin-dashboard" className="px-4 py-2 rounded-md bg-slate-950 text-sm font-medium text-white">
                    Admin
                  </Link>
                ) : null}
                {!isAdmin ? (
                  <Link onClick={closeMenu} to="/dashboard" className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-700">
                    Dashboard
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="px-4 py-2 rounded-md bg-gray-100 text-left text-sm font-medium text-gray-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link onClick={closeMenu} to="/register" className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-700">
                  Register
                </Link>
                <Link onClick={closeMenu} to="/login" className="px-4 py-2 rounded-md bg-gray-100 text-sm font-medium text-gray-800">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
