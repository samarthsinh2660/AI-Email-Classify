/**
 * Utility Functions
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Extract email address from "Name <email@domain.com>" format
 */
export function extractEmail(emailString: string): string {
  const match = emailString.match(/<(.+)>/);
  return match ? match[1] : emailString;
}

/**
 * Extract name from "Name <email@domain.com>" format
 */
export function extractName(emailString: string): string {
  const match = emailString.match(/^([^<]+)/);
  return match ? match[1].trim() : emailString;
}

/**
 * Get category color
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Important: 'bg-green-100 text-green-800 border-green-200',
    Promotional: 'bg-blue-100 text-blue-800 border-blue-200',
    Social: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Marketing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Spam: 'bg-red-100 text-red-800 border-red-200',
    General: 'bg-purple-100 text-purple-800 border-purple-200',
  };
  return colors[category] || colors.General;
}

/**
 * Get category icon
 */
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    Important: '⚠️',
    Promotional: '🎁',
    Social: '👥',
    Marketing: '📢',
    Spam: '🚫',
    General: '📧',
  };
  return icons[category] || icons.General;
}
