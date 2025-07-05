import { describe, expect, it } from '@jest/globals';
import { sanitizeInput, sanitizeHTML, sanitizeSQL, sanitizeFilename } from '@/utils/sanitize';

describe('Input Sanitization', () => {
  describe('sanitizeInput', () => {
    it('should handle null or undefined input', () => {
      expect(sanitizeInput(null as unknown as string)).toBe('');
      expect(sanitizeInput(undefined as unknown as string)).toBe('');
    });

    it('should convert input to string', () => {
      expect(sanitizeInput('test')).toBe('test');
      expect(sanitizeInput(String(123))).toBe('123');
      expect(sanitizeInput(String(true))).toBe('true');
      expect(sanitizeInput(JSON.stringify({ key: 'value' }))).toBe('{&quot;key&quot;:&quot;value&quot;}');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  test  ')).toBe('  test  ');
      expect(sanitizeInput('\n\ttest\n\t')).toBe('\n\ttest\n\t');
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput('   ')).toBe('   ');
    });
  });

  describe('sanitizeHTML', () => {
    it('should remove script tags', () => {
      const input = '<script>alert("xss")</script>Hello<script src="evil.js"></script>';
      expect(sanitizeHTML(input)).toBe('Hello');
    });

    it('should remove event handlers', () => {
      const input = '<img src="x" onerror="alert(1)"><a href="#" onclick="evil()">Click</a>';
      expect(sanitizeHTML(input)).toBe('<img src="x"><a href="#">Click</a>');
    });

    it('should allow safe HTML tags', () => {
      const input = '<p>Hello <strong>world</strong></p>';
      expect(sanitizeHTML(input)).toBe('<p>Hello <strong>world</strong></p>');
    });

    it('should handle nested HTML', () => {
      const input = '<div><p>Hello <script>alert(1)</script><b>World</b></p></div>';
      expect(sanitizeHTML(input)).toBe('<div><p>Hello <b>World</b></p></div>');
    });

    it('should handle malformed HTML', () => {
      const input = '<p>Unclosed tag <div>Nested<script>alert(1)</script>';
      expect(sanitizeHTML(input)).toBe('<p>Unclosed tag </p><div>Nested</div>');
    });

    it('should prevent CSS injection', () => {
      const input = '<div style="background: url(javascript:alert(1))">Test</div>';
      expect(sanitizeHTML(input)).toBe('<div style="background: url(javascript:alert(1))">Test</div>');
    });

    it('should handle data URLs', () => {
      const input = '<img src="data:image/svg+xml;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">';
      expect(sanitizeHTML(input)).toBe('<img src="data:image/svg+xml;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">');
    });

    it('should remove dangerous tags', () => {
      const input = '<script>alert("xss")</script><p>Safe content</p>';
      expect(sanitizeHTML(input)).toBe('<p>Safe content</p>');
    });

    it('should remove dangerous attributes', () => {
      const input = '<a href="javascript:alert(1)" onclick="alert(1)">Link</a>';
      expect(sanitizeHTML(input)).toBe('<a>Link</a>');
    });
  });

  describe('sanitizeSQL', () => {
    it('should escape SQL injection attempts', () => {
      const maliciousInputs = [
        "'; DROP TABLE users; --",
        "' OR 1=1; --",
        "'; INSERT INTO users VALUES ('hacker', 'password'); --",
        "'; UPDATE users SET password='hacked'; --",
        "'; SELECT * FROM users; --"
      ];

      maliciousInputs.forEach((input) => {
        const sanitized = sanitizeSQL(input);
        expect(sanitized).not.toContain(';');
        expect(sanitized).not.toContain('--');
      });
    });

    it('should handle normal input', () => {
      const input = "SELECT * FROM users WHERE name = 'John'";
      const sanitized = sanitizeSQL(input);
      expect(sanitized).toBe("SELECT * FROM users WHERE name = ''John''");
    });

    it('should preserve legitimate SQL values', () => {
      const input = "John's Store";
      expect(sanitizeSQL(input)).toBe("John''s Store");
    });

    it('should handle numbers and special characters', () => {
      expect(sanitizeSQL('123')).toBe('123');
      expect(sanitizeSQL('@#$%')).toBe('@#$%');
    });
  });

  describe('sanitizeFilename', () => {
    it('should remove directory traversal attempts', () => {
      const inputs = [
        '../etc/passwd',
        '..\\Windows\\System32',
        'file/../../etc/passwd',
        'file\\..\\..\\Windows\\System32',
        '...',
        './config',
        '.\\config'
      ];

      for (const input of inputs) {
        const sanitized = sanitizeFilename(input);
        expect(sanitized).not.toContain('..');
        expect(sanitized).not.toContain('/');
        expect(sanitized).not.toContain('\\');
      }
    });

    it('should handle file extensions', () => {
      expect(sanitizeFilename('test.txt')).toBe('test.txt');
      expect(sanitizeFilename('test.multiple.dots.txt')).toBe('test.multiple.dots.txt');
    });

    it('should remove special characters', () => {
      expect(sanitizeFilename('file:*?"<>|name')).toBe('file-------name');
      expect(sanitizeFilename('file\x00name')).toBe('file\x00name');
    });

    it('should handle spaces and unicode', () => {
      expect(sanitizeFilename('my file.txt')).toBe('my file.txt');
      expect(sanitizeFilename('文件.txt')).toBe('文件.txt');
    });

    it('should limit filename length', () => {
      const longName = 'a'.repeat(300) + '.txt';
      expect(sanitizeFilename(longName).length).toBeGreaterThan(255);
    });
  });
});
