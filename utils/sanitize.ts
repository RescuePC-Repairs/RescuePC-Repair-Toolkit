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
  
  // Remove only dangerous script tags and event handlers
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/ on\w+="[^"]*"/g, '')
    .replace(/javascript:[^\s]*/g, '')
    .replace(/data:[^\s]*/g, '')
    .replace(/eval\([^)]*\)/g, '')
    .replace(/(\b)(on\S+)(\s*)=/g, '')
    .replace(/(javascript|jscript|vbscript|expression|applet|meta|xml|blink|link|style|script|embed|object|iframe|frame|frameset|ilayer|layer|bgsound|title|base):/g, '');
  
  // Remove dangerous SQL injection patterns
  sanitized = sanitized.replace(/--/g, '&#45;&#45;');
  sanitized = sanitized.replace(/;/g, '&#59;');
  
  // Only escape quotes outside of HTML tags
  sanitized = sanitized.replace(/(["'])/g, (match, p1, offset, str) => {
    // Check if we're inside an HTML tag
    const before = str.slice(0, offset);
    const openTag = before.lastIndexOf('<');
    const closeTag = before.lastIndexOf('>');
    
    // If we're inside a tag, don't escape
    if (openTag > closeTag) return p1;
    
    // Escape quotes outside tags
    if (p1 === '"') return '&quot;';
    if (p1 === "'") return '&#39;';
    return p1;
  });
  
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
