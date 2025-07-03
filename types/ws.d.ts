declare module 'ws' {
  import { EventEmitter } from 'events';
  import { IncomingMessage } from 'http';
  import { Duplex } from 'stream';

  class WebSocket extends EventEmitter {
    static CONNECTING: number;
    static OPEN: number;
    static CLOSING: number;
    static CLOSED: number;

    constructor(address: string | URL, protocols?: string | string[]);

    readyState: number;
    protocol: string;

    close(code?: number, reason?: string): void;
    ping(data?: any, mask?: boolean, cb?: (err: Error) => void): void;
    pong(data?: any, mask?: boolean, cb?: (err: Error) => void): void;
    send(data: any, cb?: (err?: Error) => void): void;
    terminate(): void;

    on(event: 'close', listener: (code: number, reason: string) => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'message', listener: (data: string) => void): this;
    on(event: 'open', listener: () => void): this;
    on(event: 'ping' | 'pong', listener: (data: Buffer) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
  }

  class Server extends EventEmitter {
    constructor(options?: ServerOptions, callback?: () => void);

    close(cb?: (err?: Error) => void): void;
    handleUpgrade(
      request: IncomingMessage,
      socket: Duplex,
      head: Buffer,
      callback: (client: WebSocket) => void
    ): void;
    shouldHandle(request: IncomingMessage): boolean;

    on(event: 'close', listener: () => void): this;
    on(event: 'connection', listener: (socket: WebSocket, request: IncomingMessage) => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
    on(event: 'headers', listener: (headers: string[], request: IncomingMessage) => void): this;
    on(event: 'listening', listener: () => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
  }

  interface ServerOptions {
    host?: string;
    port?: number;
    backlog?: number;
    server?: any;
    verifyClient?: VerifyClientCallbackAsync | VerifyClientCallbackSync;
    handleProtocols?: (protocols: Set<string>, request: IncomingMessage) => string | false;
    path?: string;
    noServer?: boolean;
    clientTracking?: boolean;
    perMessageDeflate?: boolean | PerMessageDeflateOptions;
    maxPayload?: number;
    skipUTF8Validation?: boolean;
  }

  interface VerifyClientCallbackAsync {
    (
      info: { origin: string; secure: boolean; req: IncomingMessage },
      callback: (
        res: boolean,
        code?: number,
        message?: string,
        headers?: OutgoingHttpHeaders
      ) => void
    ): void;
  }

  interface VerifyClientCallbackSync {
    (info: { origin: string; secure: boolean; req: IncomingMessage }): boolean;
  }

  interface PerMessageDeflateOptions {
    serverNoContextTakeover?: boolean;
    clientNoContextTakeover?: boolean;
    serverMaxWindowBits?: number;
    clientMaxWindowBits?: number;
    zlibInflateOptions?: {
      chunkSize?: number;
      windowBits?: number;
      level?: number;
      memLevel?: number;
      strategy?: number;
    };
    zlibDeflateOptions?: {
      chunkSize?: number;
      windowBits?: number;
      level?: number;
      memLevel?: number;
      strategy?: number;
    };
    threshold?: number;
    concurrencyLimit?: number;
  }

  export { Server, WebSocket };
}
