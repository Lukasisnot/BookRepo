import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage/MainPage";
import About from "./About/About";
import PeriodCreateForm from "./CatCreateForm/PeriodCreateForm";
import PeriodUpdateForm from "./CatUpdateForm/PeriodUpdateForm";
import PeriodView from "./CatView/PeriodView";
import PeriodList from "./CatList/PeriodList";
import CreatedPeriod from "./CatCreateForm/CreatedPeriod";


export default function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/createperiod" element={<PeriodCreateForm />} />
          <Route path="/updateperiod/:id" element={<PeriodUpdateForm />} />
          <Route path="/period/:id" element={<PeriodView />} />
          <Route path="/period" element={<PeriodList />} />
          <Route path="/createdperiod/:id" element={<CreatedPeriod />} />
          

        </Routes>
      </BrowserRouter>
    </>
  );
}
