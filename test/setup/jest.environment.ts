import { TestEnvironment } from 'jest-environment-node';
import { TextEncoder, TextDecoder } from 'util';

class CustomEnvironment extends TestEnvironment {
  async setup() {
    await super.setup();

    // Add TextEncoder/TextDecoder to global
    if (typeof this.global.TextEncoder === 'undefined') {
      this.global.TextEncoder = TextEncoder;
    }
    if (typeof this.global.TextDecoder === 'undefined') {
      this.global.TextDecoder = TextDecoder;
    }

    // Add fetch-related globals
    if (typeof this.global.Headers === 'undefined') {
      const { Headers, Request, Response } = await import('node-fetch');
      this.global.Headers = Headers;
      this.global.Request = Request;
      this.global.Response = Response;
    }

    // Add crypto for CSRF tokens
    if (typeof this.global.crypto === 'undefined') {
      const { webcrypto } = await import('node:crypto');
      this.global.crypto = webcrypto;
    }

    // Add URL and URLSearchParams
    if (typeof this.global.URL === 'undefined') {
      const { URL, URLSearchParams } = await import('url');
      this.global.URL = URL;
      this.global.URLSearchParams = URLSearchParams;
    }

    // Add FormData
    if (typeof this.global.FormData === 'undefined') {
      const { FormData } = await import('formdata-node');
      this.global.FormData = FormData;
    }

    // Add Blob
    if (typeof this.global.Blob === 'undefined') {
      const { Blob } = await import('buffer');
      this.global.Blob = Blob;
    }

    // Add File
    if (typeof this.global.File === 'undefined') {
      const { File } = await import('buffer');
      this.global.File = File;
    }

    // Add AbortController
    if (typeof this.global.AbortController === 'undefined') {
      const { AbortController } = await import('abort-controller');
      this.global.AbortController = AbortController;
    }

    // Add performance
    if (typeof this.global.performance === 'undefined') {
      const { performance } = await import('perf_hooks');
      this.global.performance = performance;
    }

    // Add console methods if not defined
    if (typeof this.global.console === 'undefined') {
      this.global.console = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
        debug: jest.fn()
      };
    }
  }

  async teardown() {
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

export default CustomEnvironment;
