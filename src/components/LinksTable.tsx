import { useState, useMemo } from 'react';
import { Copy, Trash2, ExternalLink, Search } from 'lucide-react';
import { Link } from '../lib/supabase';
import { deleteLink } from '../api/links';

interface LinksTableProps {
  links: Link[];
  onDelete: () => void;
}

type SortField = 'code' | 'url' | 'total_clicks' | 'last_clicked';
type SortOrder = 'asc' | 'desc';

export function LinksTable({ links, onDelete }: LinksTableProps) {
  const [sortField, setSortField] = useState<SortField>('total_clicks');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [search, setSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedLinks = useMemo(() => {
    let filtered = links;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = links.filter(
        (link) =>
          (link.code || '').toLowerCase().includes(searchLower) ||
          (link.url || '').toLowerCase().includes(searchLower)
      );
    }

    return [...filtered].sort((a, b) => {
      // handle numeric sort for total_clicks separately for correctness
      if (sortField === 'total_clicks') {
        const aNum = a.total_clicks ?? 0;
        const bNum = b.total_clicks ?? 0;
        if (aNum < bNum) return sortOrder === 'asc' ? -1 : 1;
        if (aNum > bNum) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }

      // string comparisons (safe fallback to empty string)
      const aVal = String((a as any)[sortField] ?? '');
      const bVal = String((b as any)[sortField] ?? '');

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [links, search, sortField, sortOrder]);

  const handleCopy = async (code: string) => {
    const url = `${window.location.origin}/${code}`;
    await navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDelete = async (code: string) => {
    if (!confirm(`Delete link "${code}"?`)) return;

    const result = await deleteLink(code);
    if (result.success) {
      onDelete();
    } else {
      alert(result.error || 'Failed to delete link');
    }
  };

  const truncateUrl = (url?: string, maxLength: number = 50) => {
    if (!url) return '';
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };

  // <-- IMPORTANT: accept undefined as well
  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'Never';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Invalid date';
    return d.toLocaleString();
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  if (!links || links.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No links yet. Create your first short link above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by code or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('code')}
              >
                Short Code <SortIcon field="code" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('url')}
              >
                Target URL <SortIcon field="url" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('total_clicks')}
              >
                Clicks <SortIcon field="total_clicks" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('last_clicked')}
              >
                Last Clicked <SortIcon field="last_clicked" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedLinks.map((link) => (
              <tr key={link.code} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm font-mono text-blue-600">{link.code}</code>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-900 hover:text-blue-600 flex items-center gap-1"
                    title={link.url}
                  >
                    {truncateUrl(link.url)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {link.total_clicks ?? 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(link.last_clicked)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(link.code)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Copy short URL"
                    >
                      {copiedCode === link.code ? (
                        <span className="text-xs text-green-600 font-medium">Copied!</span>
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(link.code)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
