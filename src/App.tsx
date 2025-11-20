import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Redirect from './pages/Redirect';
import Stats from './pages/Stats';
import Healthcheck from './pages/Healthcheck';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentPath === '/' || currentPath === '') {
    return <Dashboard />;
  }

  if (currentPath === '/healthz') {
    return <Healthcheck />;
  }

  const codeMatch = currentPath.match(/^\/code\/([A-Za-z0-9]{6,8})$/);
  if (codeMatch) {
    return <Stats code={codeMatch[1]} />;
  }

  const redirectMatch = currentPath.match(/^\/([A-Za-z0-9]{6,8})$/);
  if (redirectMatch) {
    return <Redirect code={redirectMatch[1]} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-600 mb-4">Page not found</p>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

export default App;
