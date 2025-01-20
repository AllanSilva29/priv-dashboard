import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add global styles to prevent scrolling
import { useEffect } from 'react';

function Root() {
  useEffect(() => {
    // Add overflow-hidden to body when component mounts
    document.body.style.overflow = 'hidden';
    
    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
