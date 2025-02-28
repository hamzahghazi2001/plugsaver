import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./Pages/WelcomePage";
import LoginPage from "./Pages/LoginPage";
import RegistrationPage from "./Pages/RegistrationPage";
import RoleSelection from "./Pages/RoleSelection";
import HouseholdManager from "./Pages/HouseholdManager";
import HouseholdMember from "./Pages/HouseholdMember";
import RewardsPage from "./Pages/RewardsPage";
import DeviceFlow from "./Pages/DeviceFlow";
import DeviceEdit from "./Pages/DeviceEdit";
import HomePage from "./Pages/HomePage";



import "./App.css";
import SupportPages from "./Pages/SupportPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/RegistrationPage" element={<RegistrationPage />} />
        <Route path="/RoleSelection" element={<RoleSelection />} />
        <Route path="/householdmanager" element={<HouseholdManager />} />
        <Route path="/householdmember" element={<HouseholdMember />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/RewardsPage" element={<RewardsPage />} />
        <Route path="/deviceflow" element={<DeviceFlow />} />
        <Route path="/supportpage" element={<SupportPages />} />
        <Route path="/DeviceEdit" element={<DeviceEdit />} />
        <Route path="/HomePage" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
