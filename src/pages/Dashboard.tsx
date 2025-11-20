import { useState, useEffect } from 'react';
import { Link2 } from 'lucide-react';
import { CreateLinkForm } from '../components/CreateLinkForm';
import { LinksTable } from '../components/LinksTable';
import { Link } from '../lib/supabase';
import { getAllLinks } from '../api/links';

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLinks = async () => {
    setLoading(true);
    setError('');

    const result = await getAllLinks();

    setLoading(false);

    if (result.success && result.data) {
      setLinks(result.data);
    } else {
      setError(result.error || 'Failed to load links');
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Link2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Short Link Manager</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CreateLinkForm onSuccess={fetchLinks} />

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">Loading links...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-12 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <LinksTable links={links} onDelete={fetchLinks} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Short Link Manager - Create and manage your short links
          </p>
        </div>
      </footer>
    </div>
  );
}
