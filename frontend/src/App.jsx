import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Discover from "./pages/Discover"
import GetInvolved from "./pages/GetInvolved"
import Contact from "./pages/Contact"
import NGOProfile from "./pages/NGOProfile"
import NGO from "./pages/NGO";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/getinvolved" element={<GetInvolved />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/ngo/:id" element={<NGOProfile />} />
      <Route path="/ngo/:id" element={<NGO />} />
    </Routes>
  )
}

export default App


