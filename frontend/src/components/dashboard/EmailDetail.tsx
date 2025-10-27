'use client';

import { ClassifiedEmail } from '@/hooks/useEmails';
import { formatDate, extractName, extractEmail, getCategoryColor, getCategoryIcon } from '@/lib/utils';
import { X, Mail, Calendar, Tag } from 'lucide-react';
import { useEffect } from 'react';

interface EmailDetailProps {
  email: ClassifiedEmail;
  onClose: () => void;
}

export default function EmailDetail({ email, onClose }: EmailDetailProps) {
  // Prevent body scroll when detail is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      
      {/* Slide-in Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 bg-gray-100 shadow-2xl z-50 overflow-y-auto">
        <div className="bg-white min-h-full">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h3 className="text-lg font-semibold text-gray-900">Email Details</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Category Badge */}
            <div className="flex items-center justify-end">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                <span className="mr-2 text-lg">{getCategoryIcon(email.category)}</span>
                {email.category}
              </span>
            </div>

            {/* Subject */}
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {email.subject || '(No Subject)'}
              </h4>
            </div>

            {/* From */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">From</p>
                  <p className="text-sm font-semibold text-gray-900">{extractName(email.from)}</p>
                  <p className="text-xs text-gray-500 break-all">{extractEmail(email.from)}</p>
                </div>
              </div>
            </div>

            {/* To */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">To</p>
                  <p className="text-xs text-gray-500 break-all">{email.to}</p>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Date</p>
                  <p className="text-sm text-gray-900">{formatDate(email.date)}</p>
                  <p className="text-xs text-gray-500">{email.date}</p>
                </div>
              </div>
            </div>

            {/* Labels */}
            {email.labels && email.labels.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-2">Gmail Labels</p>
                    <div className="flex flex-wrap gap-2">
                      {email.labels.slice(0, 5).map((label, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Snippet/Preview */}
            <div className="border-t pt-6">
              <h5 className="text-sm font-semibold text-gray-900 mb-3">Preview</h5>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{email.snippet}</p>
              </div>
            </div>

            {/* Body (if available) */}
            {email.body && email.body !== email.snippet && (
              <div className="border-t pt-6">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Email Content</h5>
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <div 
                    className="text-sm text-gray-700 [&_img]:max-w-full [&_img]:h-auto [&_a]:text-blue-600 [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: email.body }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
