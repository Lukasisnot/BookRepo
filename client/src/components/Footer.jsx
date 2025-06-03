// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter, FaBook } from 'react-icons/fa';
import { SiTailwindcss, SiReact } from 'react-icons/si';

const Footer = ({ user }) => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', icon: FaGithub, href: 'https://github.com/Lukasisnot/BookRepo', label: 'Our GitHub Repository' },
    { name: 'LinkedIn', icon: FaLinkedin, href: '#', label: 'Our LinkedIn' },
    { name: 'Twitter', icon: FaTwitter, href: '#', label: 'Follow us on Twitter' },
  ];

  const footerSections = [
    {
      title: "Explore",
      links: [
        { name: "Home", href: "/", show: 'always' },
        { name: "All Books", href: "/book", show: 'always' },
        { name: "All Authors", href: "/author", show: 'always' },
        { name: "Literary Periods", href: "/period", show: 'always' },
        { name: "Literary Groups", href: "/literary-group", show: 'always' },
      ],
    },
    {
      title: "Your Account",
      links: [
        { name: "My Favorites", href: "/my-favorites", show: 'loggedIn' },
        { name: "Admin Dashboard", href: "/dashboard", show: 'adminOnly' },
        { name: "Login", href: "/login", show: 'loggedOut' },
        { name: "Register", href: "/register", show: 'loggedOut' },
      ],
    },
    {
      title: "Information",
      links: [
        { name: "About Book Repo", href: "/about", show: 'always' },
      ],
    },
  ];

  const shouldShowLink = (showCondition) => {
    if (showCondition === 'always') return true;
    if (showCondition === 'loggedIn' && user) return true;
    if (showCondition === 'loggedOut' && !user) return true;
    if (showCondition === 'adminOnly' && user && user.role === 'admin') return true;
    return false;
  };

  return (
    // REMOVED 'bg-slate-900' from here
    <footer className="text-slate-300 shrink-0 border-t-5 border-indigo-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-10 mb-10">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center mb-4 group">
              <FaBook className="h-8 w-8 mr-3 text-sky-400 group-hover:text-sky-300 transition-colors" />
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400 group-hover:opacity-90 transition-opacity">
                Book Repo
              </span>
            </Link>
            <p className="text-sm text-slate-400 mb-6 max-w-md">
              Explore a comprehensive collection of literary works, authors, and periods. Your gateway to the world of literature.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-sky-400 transition-colors duration-200"
                  >
                    <social.icon size={22} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {footerSections.map((section) => {
            const visibleLinks = section.links.filter(link => shouldShowLink(link.show));
            if (visibleLinks.length === 0) return null;

            return (
              <div key={section.title}>
                <h5 className="text-base font-semibold text-sky-300 mb-4 tracking-wider uppercase">
                  {section.title}
                </h5>
                <ul className="space-y-3">
                  {visibleLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-slate-400 hover:text-sky-300 hover:underline underline-offset-4 decoration-sky-500/50 transition-all duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-800 pt-8 mt-8 text-center sm:text-left sm:flex sm:justify-between sm:items-center">
          <p className="text-xs sm:text-sm text-slate-500">
            © {currentYear} Book Repo. All Rights Reserved.
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4 sm:mt-0 text-slate-500">
            <span className="text-xs">Powered by</span>
            <SiReact size={18} className="hover:text-sky-400 transition-colors" title="React" />
            <SiTailwindcss size={18} className="hover:text-sky-400 transition-colors" title="Tailwind CSS" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;