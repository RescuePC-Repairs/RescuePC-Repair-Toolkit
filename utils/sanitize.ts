import DOMPurify from 'isomorphic-dompurify';
import { escape } from 'html-escaper';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} input - The input HTML to sanitize
 * @returns {string} The sanitized HTML
 */
export function sanitizeHTML(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    ADD_TAGS: [],
    ADD_ATTR: [],
    USE_PROFILES: { html: true }
  });
}

/**
 * Sanitizes text input to prevent injection attacks
 * @param {string} input - The input text to sanitize
 * @returns {string} The sanitized text
 */
export function sanitizeInput(input: string | null | undefined): string {
  if (!input) {
    return '';
  }

  // First escape HTML entities
  let sanitized = escape(input);

  // Remove potentially dangerous patterns
  sanitized = sanitized
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove onclick and similar
    .replace(/ on\w+="[^"]*"/g, '')
    // Remove javascript: URLs
    .replace(/javascript:[^\s]*/g, '')
    // Remove data: URLs
    .replace(/data:[^\s]*/g, '')
    // Remove eval() and similar
    .replace(/eval\([^)]*\)/g, '')
    // Remove SQL injection attempts
    .replace(/(\b)(on\S+)(\s*)=/g, '')
    .replace(
      /(javascript|jscript|vbscript|expression|applet|meta|xml|blink|link|style|script|embed|object|iframe|frame|frameset|ilayer|layer|bgsound|title|base):/g,
      ''
    );

  return sanitized;
}

/**
 * Sanitizes a filename to prevent directory traversal and other attacks
 * @param {string} filename - The filename to sanitize
 * @returns {string} The sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[/\\?%*:|"<>]/g, '-') // Replace invalid characters
    .replace(/^\.+/, '') // Remove leading dots
    .replace(/\.+$/, '') // Remove trailing dots
    .replace(/\.\./g, '-'); // Replace double dots
}

/**
 * Sanitizes SQL input to prevent SQL injection
 * @param {string} input - The SQL input to sanitize
 * @returns {string} The sanitized SQL input
 */
export function sanitizeSQL(input: string): string {
  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/--/g, '') // Remove SQL comments
    .replace(/;/g, '') // Remove semicolons
    .replace(/\/\*/g, '') // Remove comment starts
    .replace(/\*\//g, '') // Remove comment ends
    .replace(/xp_/g, '') // Remove xp_ stored procedures
    .replace(/sp_/g, '') // Remove sp_ stored procedures
    .replace(/exec\s+/g, '') // Remove exec statements
    .replace(/execute\s+/g, '') // Remove execute statements
    .replace(/drop\s+/g, '') // Remove drop statements
    .replace(/delete\s+/g, '') // Remove delete statements
    .replace(/update\s+/g, '') // Remove update statements
    .replace(/insert\s+/g, '') // Remove insert statements
    .replace(/select\s+/g, '') // Remove select statements
    .replace(/union\s+/g, '') // Remove union statements
    .replace(/where\s+/g, '') // Remove where statements
    .trim();
}

/**
 * Sanitizes a URL to prevent malicious redirects and other attacks
 * @param {string} url - The URL to sanitize
 * @returns {string} The sanitized URL
 */
export function sanitizeURL(url: string): string {
  try {
    const parsed = new URL(url);

    // Only allow specific protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }

    // Remove username/password if present
    parsed.username = '';
    parsed.password = '';

    // Remove hash
    parsed.hash = '';

    // Remove potentially dangerous search params
    const dangerousParams = ['redirect', 'return', 'return_to', 'return_path', 'path'];
    dangerousParams.forEach((param) => parsed.searchParams.delete(param));

    return parsed.toString();
  } catch {
    return '';
  }
}
