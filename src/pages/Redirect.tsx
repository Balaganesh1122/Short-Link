import { useEffect, useState } from 'react';
import { trackClick } from '../api/links';

interface RedirectProps {
  code: string;
}

export default function Redirect({ code }: RedirectProps) {
  const [error, setError] = useState('');

  useEffect(() => {
    const handleRedirect = async () => {
      const result = await trackClick(code);

      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        setError('Link not found');
      }
    };

    handleRedirect();
  }, [code]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">404</h1>
          <p className="text-gray-600 mb-4">{error}</p>
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
