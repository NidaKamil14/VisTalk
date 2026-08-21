import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Learn from "./pages/Learn";
import AlphabetLesson from "./pages/AlphabetLesson";
import LetterLesson from "./pages/LetterLesson";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/alphabets" element={<AlphabetLesson />} />
        <Route path="/learn/alphabets/:letter" element={<LetterLesson />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;