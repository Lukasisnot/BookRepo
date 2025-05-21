import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage/MainPage";
import About from "./About/About";
import PeriodCreateForm from "./CatCreateForm/PeriodCreateForm";
import CatUpdateForm from "./CatUpdateForm/PeriodUpdateForm";
import CatView from "./CatView/PeriodView";
import CatList from "./CatList/PeriodList";
import CreatedCat from "./CatCreateForm/CreatedPeriod";


export default function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/createcat" element={<PeriodCreateForm />} />
          <Route path="/updatecat/:id" element={<CatUpdateForm />} />
          <Route path="/cat/:id" element={<CatView />} />
          <Route path="/cats" element={<CatList />} />
          <Route path="/createdcat/:id" element={<CreatedCat />} />
          

        </Routes>
      </BrowserRouter>
    </>
  );
}
