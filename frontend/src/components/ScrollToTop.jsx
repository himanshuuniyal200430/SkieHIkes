import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Drop this once, inside <BrowserRouter>, above your <Routes>.
// React Router doesn't reset scroll position on navigation by itself —
// this watches the URL and scrolls back to the top whenever it changes.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;