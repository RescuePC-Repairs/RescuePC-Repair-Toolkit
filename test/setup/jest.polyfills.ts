import { TextEncoder, TextDecoder } from 'util';
import { Buffer } from 'buffer';
import crypto from 'crypto';
import { Headers, Request, Response } from 'node-fetch';
import { FormData } from 'formdata-node';
import { AbortController } from 'abort-controller';
import { webcrypto } from 'node:crypto';
import { URL, URLSearchParams } from 'url';
import { Blob, File } from 'buffer';
import { performance } from 'perf_hooks';

// Polyfill TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill Buffer
global.Buffer = Buffer;

// Polyfill crypto
const mockCrypto = {
  getRandomValues: (buffer: Uint8Array) => buffer.map(() => Math.floor(Math.random() * 256)),
  randomBytes: (size: number) =>
    Buffer.from(
      Array(size)
        .fill(0)
        .map(() => Math.floor(Math.random() * 256))
    ),
  subtle: {
    digest: jest.fn(),
    encrypt: jest.fn(),
    decrypt: jest.fn(),
    sign: jest.fn(),
    verify: jest.fn(),
    generateKey: jest.fn(),
    deriveKey: jest.fn(),
    deriveBits: jest.fn(),
    importKey: jest.fn(),
    exportKey: jest.fn(),
    wrapKey: jest.fn(),
    unwrapKey: jest.fn()
  }
};

global.crypto = mockCrypto as unknown as Crypto;

// Polyfill fetch
global.fetch = jest.fn();
global.Request = Request;
global.Response = Response;
global.Headers = Headers;

// Polyfill URL
global.URL = URL;
global.URLSearchParams = URLSearchParams;

// Polyfill performance
global.performance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn(),
  getEntriesByType: jest.fn(),
  getEntries: jest.fn(),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  timeOrigin: Date.now(),
  timing: {
    navigationStart: Date.now()
  }
} as unknown as Performance;

// Polyfill localStorage
class LocalStorageMock {
  private store: { [key: string]: string };

  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  key(index: number) {
    return Object.keys(this.store)[index] || null;
  }

  get length() {
    return Object.keys(this.store).length;
  }
}

global.localStorage = new LocalStorageMock();

// Polyfill sessionStorage
global.sessionStorage = new LocalStorageMock();

// Polyfill console methods
const originalConsole = { ...console };
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
};

// Restore console after tests
afterAll(() => {
  global.console = originalConsole;
});

// Add FormData
global.FormData = FormData;

// Add Blob and File
global.Blob = Blob;
global.File = File;

// Add AbortController
global.AbortController = AbortController;

// Add crypto
global.crypto = webcrypto;

// Add performance
global.performance = performance;

// Add fetch
global.fetch = jest.fn();

// Add console methods
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};
