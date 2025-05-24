import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage/MainPage";
import About from "./About/About";
import PeriodCreateForm from "./Period/PeriodCreateForm/PeriodCreateForm";
import PeriodUpdateForm from "./Period/PeriodUpdateForm/PeriodUpdateForm";
import PeriodView from "./Period/PeriodView/PeriodView";
import PeriodList from "./Period/PeriodList/PeriodList";
import CreatedPeriod from "./Period/PeriodCreateForm/CreatedPeriod";
import CreatedLiteraryGroup from "./LiteraryGroup/LiteraryGroupCreateForm/CreatedLiteraryGroup";
import LiteraryGroupList from "./LiteraryGroup/LiteraryGroupList/LiteraryGroupList";
import LiteraryGroupView from "./LiteraryGroup/LiteraryGroupView/LiteraryGroupView";
import LiteraryGroupUpdateForm from "./LiteraryGroup/LiteraryGroupUpdateForm/LiteraryGroupUpdateForm";
import LiteraryGroupCreateForm from "./LiteraryGroup/LiteraryGroupCreateForm/LiteraryGroupCreateForm";





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
          <Route path="/createdliterary-group/:id" element={<CreatedLiteraryGroup />} />
          <Route path="/updateliterary-group/:id" element={<LiteraryGroupUpdateForm />} />
          <Route path="/literary-group/:id" element={<LiteraryGroupView />} />
          <Route path="/literary-group" element={<LiteraryGroupList />} />
          <Route path="/createliterary-group" element={<LiteraryGroupCreateForm />} />







          

        </Routes>
      </BrowserRouter>
    </>
  );
}
