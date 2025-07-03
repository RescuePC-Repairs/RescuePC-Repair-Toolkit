import { describe, expect, it } from '@jest/globals';
import { sanitizeInput, sanitizeHTML, sanitizeSQL, sanitizeFilename } from '@/utils/sanitize';

describe('Input Sanitization', () => {
  describe('sanitizeInput', () => {
    it('should handle null or undefined input', () => {
      expect(sanitizeInput(null as unknown as string)).toBe('');
      expect(sanitizeInput(undefined as unknown as string)).toBe('');
    });

    it('should convert input to string', () => {
      expect(sanitizeInput(String(123))).toBe('123');
      expect(sanitizeInput(String(true))).toBe('true');
      expect(sanitizeInput(JSON.stringify({ key: 'value' }))).toBe('{"key":"value"}');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  test  ')).toBe('test');
      expect(sanitizeInput('\n\ttest\n\t')).toBe('test');
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput('   ')).toBe('');
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
      const input = '<p>Hello</p><a href="https://safe.com">Link</a><br><strong>Bold</strong>';
      expect(sanitizeHTML(input)).toBe(input);
    });

    it('should handle nested HTML', () => {
      const input = '<div><p>Hello <script>alert(1)</script><b>World</b></p></div>';
      expect(sanitizeHTML(input)).toBe('<div><p>Hello <b>World</b></p></div>');
    });

    it('should handle malformed HTML', () => {
      const input = '<p>Unclosed tag <div>Nested<script>alert(1)</script>';
      expect(sanitizeHTML(input)).toBe('<p>Unclosed tag <div>Nested</div></p>');
    });

    it('should prevent CSS injection', () => {
      const input = '<div style="background: url(javascript:alert(1))">Test</div>';
      expect(sanitizeHTML(input)).not.toContain('javascript:');
    });

    it('should handle data URLs', () => {
      const input = '<img src="data:image/svg+xml;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">';
      expect(sanitizeHTML(input)).not.toContain('data:');
    });
  });

  describe('sanitizeSQL', () => {
    it('should escape SQL injection attempts', () => {
      const inputs = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "admin'--",
        '1; DELETE FROM users',
        "' UNION SELECT * FROM passwords --",
        '); DROP TABLE users; --'
      ];

      for (const input of inputs) {
        const sanitized = sanitizeSQL(input);
        expect(sanitized).not.toContain(';');
        expect(sanitized).not.toContain('--');
        expect(sanitized).not.toContain('DROP');
        expect(sanitized).not.toContain('DELETE');
        expect(sanitized).not.toContain('UNION');
      }
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
      expect(sanitizeFilename('file:*?"<>|name')).toBe('filename');
      expect(sanitizeFilename('file\x00name')).toBe('filename');
    });

    it('should handle spaces and unicode', () => {
      expect(sanitizeFilename('my file.txt')).toBe('my_file.txt');
      expect(sanitizeFilename('文件.txt')).toBe('文件.txt');
    });

    it('should limit filename length', () => {
      const longName = 'a'.repeat(300) + '.txt';
      expect(sanitizeFilename(longName).length).toBeLessThanOrEqual(255);
    });
  });
});
