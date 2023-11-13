import { Context, HttpRequest } from '@azure/functions';
import { AzureHttpAdapter } from '../adapter/azure-http-adapter';
import { createApp } from '../src/cats/cat.azure';

export default function(context: Context, req: HttpRequest): void {
  //console.log("Cat function adapter", context, req);
  AzureHttpAdapter.handle(createApp, context, req, "cats");
}
