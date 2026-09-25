import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// On GitHub Pages project sites the app lives under /<repo>/; on a
// custom domain or in dev it lives at the root.
const BASENAME = import.meta.env.PROD
  ? `/${import.meta.env.VITE_REPO_NAME || 'FightingChance'}`
  : '/';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramPage from './pages/ProgramPage';
import LocationsPage from './pages/LocationsPage';
import ReferralPage from './pages/ReferralPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  // Splash shows once per full page load (not per route change).
  // The callback identity is stable (useCallback) so the splash's
  // internal timers are never torn down and restarted by a re-render.
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <BrowserRouter basename={BASENAME}>
      <SplashScreen onDone={handleSplashDone} />
      <div aria-hidden={!splashDone} style={splashDone ? undefined : { pointerEvents: 'none' }}>
        <Navbar />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/program" element={<ProgramPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/referral" element={<ReferralPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
