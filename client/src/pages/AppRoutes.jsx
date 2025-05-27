import { BrowserRouter, Routes, Route } from "react-router-dom";

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

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage2 />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<MainPage />} />


        {/* Period */}
        <Route path="/createperiod" element={<PeriodCreateForm />} />
        <Route path="/createdperiod/:id" element={<CreatedPeriod />} />
        <Route path="/updateperiod/:id" element={<PeriodUpdateForm />} />
        <Route path="/period/:id" element={<PeriodView />} />
        <Route path="/period" element={<PeriodList />} />

        {/* Literary Group */}
        <Route path="/createliterary-group" element={<LiteraryGroupCreateForm />} />
        <Route path="/createdliterary-group/:id" element={<CreatedLiteraryGroup />} />
        <Route path="/updateliterary-group/:id" element={<LiteraryGroupUpdateForm />} />
        <Route path="/literary-group/:id" element={<LiteraryGroupView />} />
        <Route path="/literary-group" element={<LiteraryGroupList />} />

        {/* Author */}
        <Route path="/createauthor" element={<AuthorCreateForm />} />
        <Route path="/createdauthor/:id" element={<CreatedAuthor />} />
        <Route path="/updateauthor/:id" element={<AuthorUpdateForm />} />
        <Route path="/author/:id" element={<AuthorView />} />
        <Route path="/author" element={<AuthorList />} />

        {/* Book */}
        <Route path="/createbook" element={<BookCreateForm />} />
        <Route path="/createdbook/:id" element={<CreatedBook />} />
        <Route path="/book/:id" element={<BookView />} />
        <Route path="/updatebook/:id" element={<BookUpdateForm />} />
        <Route path="/book" element={<BookList />} />
      </Routes>
    </BrowserRouter>
  );
}
