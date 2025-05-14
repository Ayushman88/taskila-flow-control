
declare module 'firebase-functions' {
  export interface HttpsError {
    code: string;
    message: string;
    details?: any;
  }

  export namespace https {
    export function HttpsError(code: string, message: string, details?: any): HttpsError;
    export function onCall(handler: (data: any, context: CallableContext) => any): CloudFunction<any>;
    export function onRequest(handler: (req: Request, res: Response) => any): CloudFunction<any>;
  }

  export interface CallableContext {
    auth?: {
      uid: string;
      token: {
        [key: string]: any;
      };
    };
    rawRequest: any;
  }

  export interface CloudFunction<T> {
    run: (data: T) => Promise<any>;
  }
}
