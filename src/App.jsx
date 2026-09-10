import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ProgressProvider } from "./context/ProgressContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Learn from "./pages/Learn";
import AlphabetLesson from "./pages/AlphabetLesson";
import LetterLesson from "./pages/LetterLesson";
import CategoryLesson from "./pages/CategoryLesson";
import SingleLesson from "./pages/SingleLesson";
import Practice from "./pages/Practice";
import Progress from "./pages/Progress";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import XpToast from "./components/XpToast";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <BrowserRouter>
            <div className="app-container">
              <Navbar />
              <XpToast />

              <div className="main-content">
                <Routes>
                  {/* Landing & Learning Flow */}
                  <Route path="/" element={<Hero />} />
                  <Route path="/learn" element={<Learn />} />

                  {/* Specific Alphabet Route (preserves existing URLs) */}
                  <Route path="/learn/alphabets" element={<AlphabetLesson />} />
                  <Route path="/learn/alphabets/:letter" element={<LetterLesson />} />

                  {/* Dynamic Category & Single Item Routes */}
                  <Route path="/learn/:category" element={<CategoryLesson />} />
                  <Route path="/learn/:category/:id" element={<SingleLesson />} />

                  {/* Practice & Progress */}
                  <Route path="/practice" element={<Practice />} />
                  <Route path="/progress" element={<Progress />} />

                  {/* Authentication & Account */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={<Profile />} />

                  {/* 404 Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>

              <Footer />
            </div>
          </BrowserRouter>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;