'use client';

import { ClassifiedEmail, EmailCategory } from '@/hooks/useEmails';
import { getCategoryColor, getCategoryIcon } from '@/lib/utils';

interface StatsPanelProps {
  emails: ClassifiedEmail[];
}

export default function StatsPanel({ emails }: StatsPanelProps) {
  const categories: EmailCategory[] = ['Important', 'Promotional', 'Social', 'Marketing', 'Spam', 'General'];

  const stats = categories.map((category) => {
    const count = emails.filter((email) => email.category === category).length;
    const percentage = emails.length > 0 ? ((count / emails.length) * 100).toFixed(1) : '0';
    return { category, count, percentage };
  }).filter(stat => stat.count > 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Classification Statistics</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map(({ category, count, percentage }) => (
          <div
            key={category}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 text-2xl bg-gray-100 text-gray-600">
              {getCategoryIcon(category)}
            </div>
            <p className="text-sm font-medium text-gray-700 text-center mb-1">{category}</p>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
            <p className="text-xs text-gray-500">{percentage}%</p>
          </div>
        ))}
      </div>

      {stats.length === 0 && (
        <p className="text-center text-gray-500 py-4">No emails classified yet</p>
      )}
    </div>
  );
}
