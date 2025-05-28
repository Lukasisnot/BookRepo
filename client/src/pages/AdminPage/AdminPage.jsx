
import "./MainPage.css"; 

import NavBar from "../../components/NavBar";
import { Link } from "react-router-dom";


const SectionCard = ({ title, createLink, viewLink, createText, viewText, icon }) => (
  <div className="bg-slate-800/70 backdrop-blur-md shadow-2xl rounded-xl p-6 sm:p-8 transition-all hover:shadow-slate-900/50 hover:bg-slate-800/80">
    <div className="flex items-center mb-5 sm:mb-6">
      {icon && <div className="mr-4 text-sky-400">{icon}</div>}
      <h2 className="text-2xl sm:text-3xl font-bold text-sky-300">
        {title}
      </h2>
    </div>
    <div className="space-y-3 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
      {createLink && (
        <Link
          to={createLink}
          className="flex-1 text-center px-5 py-2.5 sm:py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-400"
        >
          {createText || `Create New ${title.endsWith('s') ? title.slice(0, -1) : title}`}
        </Link>
      )}
      {viewLink && (
        <Link
          to={viewLink}
          className="flex-1 text-center px-5 py-2.5 sm:py-3 bg-slate-700 hover:bg-slate-600/90 text-slate-100 font-semibold rounded-lg shadow-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500"
        >
          {viewText || `View All ${title}`}
        </Link>
      )}
    </div>
  </div>
);


const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-2.144M9 13h0M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> {/* Placeholder, more like a shopping cart, update if better icon available */}
  </svg>
);
const UserCircleIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const BookOpenIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m0 0a8.487 8.487 0 01-7.5-5.247 8.487 8.487 0 017.5-5.247m0 10.494A8.487 8.487 0 0019.5 12.5a8.487 8.487 0 00-7.5-5.247m0 10.494v-4.247M12 12.732V6.253" /> {/* This is a placeholder, you might want a better book icon */}
  </svg>
);


export default function AdminPage() {
 

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100 px-4 pb-12 antialiased">
        {/* Adjust pt-20 or pt-24 depending on your NavBar's height if it's fixed */}
        <div className="pt-20 sm:pt-24"> 
          <header className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500">
              Content Management
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
              Oversee and expand your digital literary archive.
            </p>
          </header>

          <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10">
            <SectionCard
              title="Periods"
              createLink="/createperiod"
              viewLink="/period"
              icon={<CalendarIcon />}
            />

            <SectionCard
              title="Literary Groups"
              createLink="/createliterary-group"
              viewLink="/literary-group"
              icon={<UsersIcon />}
            />

            <SectionCard
              title="Authors"
              createLink="/createauthor"
              viewLink="/author"
              icon={<UserCircleIcon />}
            />

            <SectionCard
              title="Books"
              createLink="/createbook"
              viewLink="/book"
              icon={<BookOpenIcon />}
            />
            
           
          </div>
        </div>
      </div>
    </>
  );
}