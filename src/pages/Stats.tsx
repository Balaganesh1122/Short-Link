import { useEffect, useState } from 'react';
import { Link2, ExternalLink, MousePointerClick, Clock } from 'lucide-react';
import { Link } from '../lib/supabase';
import { getLink } from '../api/links';

interface StatsProps {
  code: string;
}

export default function Stats({ code }: StatsProps) {
  const [link, setLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchLink = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await getLink(code);
        if (!mounted) return;

        setLoading(false);
        if (result.success && result.data) {
          setLink(result.data);
        } else {
          setError(result.error || 'Link not found');
        }
      } catch (err: any) {
        if (!mounted) return;
        setLoading(false);
        setError(err?.message || 'Unexpected error');
      }
    };

    fetchLink();

    return () => {
      mounted = false;
    };
  }, [code]);

  // Accept undefined | null | string
  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'Never';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Invalid date';
    return d.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">404</h1>
          <p className="text-gray-600 mb-4">{error || 'Link not found'}</p>
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Link2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Link Statistics</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-sm font-medium text-gray-600 mb-1">Short Code</h2>
            <code className="text-xl font-mono text-blue-600">
              {window.location.origin}/{link.code}
            </code>
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Target URL</h2>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 hover:text-blue-600 flex items-center gap-2 break-all"
            >
              {link.url}
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <MousePointerClick className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Clicks</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{link.total_clicks ?? 0}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-6 h-6 text-gray-600 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-600">Last Clicked</h3>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {formatDate(link.last_clicked)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <a
            href="/"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </main>
    </div>
  );
}
