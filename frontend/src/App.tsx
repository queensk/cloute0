import "./App.css";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import SignIn from "./pages/Login/SignIn";
import Home from "./pages/Home/Home";
import SignUp from "./pages/Register/SignUp";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/contact" element={<Home />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/dashboard" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
