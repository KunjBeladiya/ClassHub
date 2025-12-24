import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./components/home";
import Register from "./components/registration";
import LoginPage from "./components/login";
import  {ProfilePage} from "./components/profileModule/ProfilePage.jsx"
import  {ResourcesPage} from "./pages/resoucesPage.jsx";
import { ForumsPage } from "./pages/forumsPage.jsx";
import {ForumCreate} from "./components/forumsModule/ForumCreate.jsx"
import {ForumReplyPage} from "./components/forumsModule/ForumReplyPage.jsx"
import {EventPage} from "./pages/eventPage.jsx"

function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={ <HomePage/>} />
          <Route path="/profilePage" element={ <ProfilePage/>} />
          <Route path="/ResourcesPage" element={ <ResourcesPage/>} />
          <Route path="/ForumsPage" element={ <ForumsPage/>} />
          <Route path="/ForumCreate" element={ <ForumCreate/>} />
          <Route path="/forum/:id" element={ <ForumReplyPage/>} />
          <Route path="/EventPage" element={ <EventPage/>} />
        </Routes>
    </>
  );
}

export default App;
