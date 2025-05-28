import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react'; // Import Navbar components


import MainPage from "./AdminPage/AdminPage";
import MainPage2 from "./MainPage2/MainPage2";

import About from "./About/About";

// Period
import PeriodCreateForm from "./Period/PeriodCreateForm/PeriodCreateForm";
import CreatedPeriod from "./Period/PeriodCreateForm/CreatedPeriod";
import PeriodUpdateForm from "./Period/PeriodUpdateForm/PeriodUpdateForm";
import PeriodView from "./Period/PeriodView/PeriodView";
import PeriodList from "./Period/PeriodList/PeriodList";

// Literary Group
import LiteraryGroupCreateForm from "./LiteraryGroup/LiteraryGroupCreateForm/LiteraryGroupCreateForm";
import CreatedLiteraryGroup from "./LiteraryGroup/LiteraryGroupCreateForm/CreatedLiteraryGroup";
import LiteraryGroupUpdateForm from "./LiteraryGroup/LiteraryGroupUpdateForm/LiteraryGroupUpdateForm";
import LiteraryGroupView from "./LiteraryGroup/LiteraryGroupView/LiteraryGroupView";
import LiteraryGroupList from "./LiteraryGroup/LiteraryGroupList/LiteraryGroupList";

// Author
import AuthorCreateForm from "./Author/AuthorCreateForm/AuthorCreateForm";
import CreatedAuthor from "./Author/AuthorCreateForm/CreatedAuthor";
import AuthorUpdateForm from "./Author/AuthorUpdateForm/AuthorUpdateForm";
import AuthorView from "./Author/AuthorView/AuthorView";
import AuthorList from "./Author/AuthorList/AuthorList";

// Book
import BookCreateForm from "./Book/BookCreateForm/BookCreateForm";
import CreatedBook from "./Book/BookCreateForm/CreatedBook";
import BookView from "./Book/BookView/BookView";
import BookUpdateForm from "./Book/BookUpdateForm/BookUpdateForm";
import BookList from "./Book/BookList/BookList";

// Auth Components
import LoginForm from '../components/LoginForm'; // Adjust path if necessary
import RegisterForm from '../components/RegisterForm'; // Adjust path if necessary
import Dashboard from '../components/Dashboard'; // Adjust path if necessary
import ProtectedRoute from '../components/ProtectedRoute'; // Adjust path if necessary

export default function AppRoutes() {
  // A simple way to check login state for Navbar links
  // In a real app, this would ideally come from a global state (Context, Redux, Zustand)
  const isLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');
const isAdmin = userRole === 'admin';

  return (
    <BrowserRouter>
      <Navbar fluid rounded className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 border-b-2 border-indigo-500">
        <NavbarBrand as={Link} to="/">
          {/* Optional: Add your logo here */}
          {/* <img src="/path-to-your-logo.svg" className="mr-3 h-6 sm:h-9" alt="Logo" /> */}
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white text-indigo-500">
            Book Repo
          </span>
        </NavbarBrand>
        <NavbarToggle />
        <NavbarCollapse>
          <NavbarLink as={Link} to="/" active={window.location.pathname === '/'} className="text-indigo-500">
            Main Page
          </NavbarLink>
          <NavbarLink as={Link} to="/about" active={window.location.pathname === '/about'} className="text-indigo-500">
            About
          </NavbarLink>
          <NavbarLink as={Link} to="/period" active={window.location.pathname.startsWith('/period')} className="text-indigo-500">
            Periods
          </NavbarLink>
          <NavbarLink as={Link} to="/literary-group" active={window.location.pathname.startsWith('/literary-group')} className="text-indigo-500">
            Literary Groups
          </NavbarLink>
          <NavbarLink as={Link} to="/author" active={window.location.pathname.startsWith('/author')} className="text-indigo-500">
            Authors
          </NavbarLink>
          <NavbarLink as={Link} to="/book" active={window.location.pathname.startsWith('/book')} className="text-indigo-500">
            Books
          </NavbarLink>
          
         {isLoggedIn ? (
  <>
    {isAdmin && (
      <NavbarLink as={Link} to="/dashboard" active={window.location.pathname === '/dashboard'}>
        Dashboard
      </NavbarLink>
    )}
  </>
) : (
  <>
    <NavbarLink as={Link} to="/login" active={window.location.pathname === '/login'}>
      Login
    </NavbarLink>
    <NavbarLink as={Link} to="/register" active={window.location.pathname === '/register'}>
      Register
    </NavbarLink>
  </>
)}

          {/* Optional: DarkThemeToggle from flowbite-react if you want a dark mode switch */}
          {/* <NavbarLink><DarkThemeToggle /></NavbarLink> */}
        </NavbarCollapse>
      </Navbar>

      <div className="w-full"> {/* Removed container, m-auto, bg-gradient, size-full, antialiased */}
        <Routes>
          {/* All your <Route> components go here */}
          <Route path="/" element={<MainPage2 />} />
          <Route path="/about" element={<About />} />
          {/* ... other routes ... */}
          <Route path="/admin" element={<MainPage />} /> {/* Assuming MainPage is AutoCenterSelectedBookPage */}


          {/* Auth Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          
          {/* Protected Dashboard Route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Period Routes - Consider if these should be protected */}
          <Route path="/createperiod" element={<ProtectedRoute><PeriodCreateForm /></ProtectedRoute>} />
          <Route path="/createdperiod/:id" element={<ProtectedRoute><CreatedPeriod /></ProtectedRoute>} />
          <Route path="/updateperiod/:id" element={<ProtectedRoute><PeriodUpdateForm /></ProtectedRoute>} />
          <Route path="/period/:id" element={<PeriodView />} /> {/* View might be public */}
          <Route path="/period" element={<PeriodList />} />   {/* List might be public */}

          <Route path="/" element={<MainPage2 />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<MainPage />} />

          {/* Literary Group Routes - Consider if these should be protected */}
          <Route path="/createliterary-group" element={<ProtectedRoute><LiteraryGroupCreateForm /></ProtectedRoute>} />
          <Route path="/createdliterary-group/:id" element={<ProtectedRoute><CreatedLiteraryGroup /></ProtectedRoute>} />
          <Route path="/updateliterary-group/:id" element={<ProtectedRoute><LiteraryGroupUpdateForm /></ProtectedRoute>} />
          <Route path="/literary-group/:id" element={<LiteraryGroupView />} />
          <Route path="/literary-group" element={<LiteraryGroupList />} />

          {/* Author Routes - Consider if these should be protected */}
          <Route path="/createauthor" element={<ProtectedRoute><AuthorCreateForm /></ProtectedRoute>} />
          <Route path="/createdauthor/:id" element={<ProtectedRoute><CreatedAuthor /></ProtectedRoute>} />
          <Route path="/updateauthor/:id" element={<ProtectedRoute><AuthorUpdateForm /></ProtectedRoute>} />
          <Route path="/author/:id" element={<AuthorView />} />
          <Route path="/author" element={<AuthorList />} />

          {/* Book Routes - Consider if these should be protected */}
          <Route path="/createbook" element={<ProtectedRoute><BookCreateForm /></ProtectedRoute>} />
          <Route path="/createdbook/:id" element={<ProtectedRoute><CreatedBook /></ProtectedRoute>} />
          <Route path="/updatebook/:id" element={<ProtectedRoute><BookUpdateForm /></ProtectedRoute>} />
          <Route path="/book/:id" element={<BookView />} />
          <Route path="/book" element={<BookList />} />

          {/* Fallback for unknown paths - good to have */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}