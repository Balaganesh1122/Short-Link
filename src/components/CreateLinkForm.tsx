import { useState } from 'react';
import { AlertCircle, Link as LinkIcon } from 'lucide-react';
import { createLink } from '../api/links';
import { isValidUrl, isValidCode } from '../lib/utils';

interface CreateLinkFormProps {
  onSuccess: () => void;
}

export function CreateLinkForm({ onSuccess }: CreateLinkFormProps) {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [success, setSuccess] = useState('');

  const validateUrl = (value: string) => {
    if (!value) {
      setUrlError('URL is required');
      return false;
    }
    if (!isValidUrl(value)) {
      setUrlError('Please enter a valid URL');
      return false;
    }
    setUrlError('');
    return true;
  };

  const validateCode = (value: string) => {
    if (value && !isValidCode(value)) {
      setCodeError('Code must be 6-8 alphanumeric characters');
      return false;
    }
    setCodeError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const isUrlValid = validateUrl(url);
    const isCodeValid = validateCode(customCode);

    if (!isUrlValid || !isCodeValid) {
      return;
    }

    setLoading(true);

    const result = await createLink(url, customCode || undefined);

    setLoading(false);

    if (result.success && result.data) {
      setSuccess(`Link created: ${window.location.origin}/${result.data.code}`);
      setUrl('');
      setCustomCode('');
      onSuccess();
    } else {
      setError(result.error || 'Failed to create link');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <LinkIcon className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Create Short Link</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            Long URL *
          </label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (urlError) validateUrl(e.target.value);
            }}
            onBlur={(e) => validateUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              urlError ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {urlError && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {urlError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Custom Code (Optional)
          </label>
          <input
            id="code"
            type="text"
            value={customCode}
            onChange={(e) => {
              setCustomCode(e.target.value);
              if (codeError) validateCode(e.target.value);
            }}
            onBlur={(e) => validateCode(e.target.value)}
            placeholder="docs"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              codeError ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
            maxLength={8}
          />
          <p className="mt-1 text-xs text-gray-500">
            6-8 alphanumeric characters. Leave empty for auto-generated code.
          </p>
          {codeError && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {codeError}
            </p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !!urlError || !!codeError}
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating...' : 'Create Short Link'}
        </button>
      </div>
    </form>
  );
}
