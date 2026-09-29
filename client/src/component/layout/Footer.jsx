import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import newpurnagiri from "../../assets/logos/newpurnagiri.png"

const pageLinks = [
  { label: "Home", to: "/" },
  { label: "About us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Auto parts", to: "/parts" },
  { label: "Contact", to: "/contact" },
];

const serviceLinks = [
  "Vehicle diagnostics",
  "Engine repair",
  "Brake service",
  "Regular maintenance",
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-10 w-full border-t border-slate-200 bg-slate-50 text-slate-900 sm:mt-12">
      <div className="mx-auto w-full max-w-6xl px-4 pb-6 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <div className="grid gap-8 border-b border-slate-200 pb-8 md:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div>
            <Link
              to="/"
              aria-label="New Purnagiri Automobiles home"
              className="inline-flex rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200"
            >
              <img
                src={newpurnagiri}
                alt="New Purnagiri Automobiles"
                className="h-10 w-auto object-contain sm:h-12"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
              Reliable automotive care, genuine parts, and practical advice to keep
              every journey running smoothly.
            </p>
            <Link
              to="/service-booking"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#ef3438] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d92b30] focus:outline-none focus:ring-2 focus:ring-[#ef3438] focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              Book a service <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">Explore</h2>
              <nav aria-label="Footer navigation" className="mt-4 flex flex-col gap-2.5">
                {pageLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="w-fit text-sm text-slate-600 transition hover:text-blue-600"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-900">What we do</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                {serviceLinks.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-2 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} New Purnagiri Automobiles. All rights reserved.</p>
          <p>Automotive service you can count on.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
