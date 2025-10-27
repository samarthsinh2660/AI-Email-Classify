'use client';

import { ClassifiedEmail } from '@/hooks/useEmails';
import { cn, formatDate, extractName, getCategoryColor, getCategoryIcon } from '@/lib/utils';

interface EmailListProps {
  emails: ClassifiedEmail[];
  onEmailClick: (email: ClassifiedEmail) => void;
  selectedEmailId?: string;
}

export default function EmailList({ emails, onEmailClick, selectedEmailId }: EmailListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Classified Emails ({emails.length})
        </h2>
      </div>

      <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
        {emails.map((email) => (
          <button
            key={email.id}
            onClick={() => onEmailClick(email)}
            className={cn(
              'w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors',
              selectedEmailId === email.id && 'bg-blue-50 hover:bg-blue-50'
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {extractName(email.from)}
                </p>
                <p className="text-xs text-gray-500 truncate">{email.from}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatDate(email.date)}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    getCategoryColor(email.category)
                  )}
                >
                  <span className="mr-1">{getCategoryIcon(email.category)}</span>
                  {email.category}
                </span>
              </div>
            </div>

            <h3 className="text-sm font-medium text-gray-900 mb-1 truncate">
              {email.subject || '(No Subject)'}
            </h3>

            <p className="text-sm text-gray-600 line-clamp-2">
              {email.snippet}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
