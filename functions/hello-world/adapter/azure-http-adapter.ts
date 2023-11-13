/* eslint-disable @typescript-eslint/ban-types */
import { Context, HttpRequest } from '@azure/functions';
import { HttpServer, INestApplication } from '@nestjs/common';
import { AzureHttpRouter, createHandlerAdapter } from '@nestjs/azure-func-http';

let handler: Function;
let handlerMap: { [key: string]: Function; } = {};

export class AzureHttpAdapterStatic {
  handle(
    createApp: () => Promise<INestApplication>,
    context: Context,
    req: HttpRequest,
    key: string
  ) {
    if (handlerMap[key]) {
      return handlerMap[key](context, req);
    }
    this.createHandler(createApp, key).then((fn) => fn(context, req));
  }

  private async createHandler(
    createApp: () => Promise<
      Omit<INestApplication, 'startAllMicroservicesAsync' | 'listenAsync'>
    >,
    key: string
  ) {
    const app = await createApp();
    const adapter = app.getHttpAdapter();
    if (this.hasGetTypeMethod(adapter) && adapter.getType() === 'azure-http') {
      return (adapter as any as AzureHttpRouter).handle.bind(adapter);
    }
    const instance = app.getHttpAdapter().getInstance();
    handler = createHandlerAdapter(instance);
    handlerMap[key] = handler
    return handler;
  }

  private hasGetTypeMethod(
    adapter: HttpServer<any, any>
  ): adapter is HttpServer & { getType: Function } {
    return !!(adapter as any).getType;
  }
}

export const AzureHttpAdapter = new AzureHttpAdapterStatic();