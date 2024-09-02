import { Route, Routes } from "react-router-dom";
import Login from "../src/Components/Login";
import Home from "../src/Components/Home";
import SignUp from "../src/Components/SignUp";
import ForgotPassword from "../src/Components/ForgotPassword";
import ResetPassword from "../src/Components/ResetPassword";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;