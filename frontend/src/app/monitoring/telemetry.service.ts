import { Injectable } from '@angular/core';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { trace } from '@opentelemetry/api';

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  constructor() {
    this.initializeTracing();
  }

  private initializeTracing(): void {
    const resource = new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'ltams-frontend',
      [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'production'
    });

    const provider = new WebTracerProvider({
      resource: resource
    });

    const exporter = new OTLPTraceExporter({
      url: 'http://localhost:4318/v1/traces'
    });

    provider.addSpanProcessor(new BatchSpanProcessor(exporter));

    provider.register({
      contextManager: new ZoneContextManager()
    });

    registerInstrumentations({
      instrumentations: [
        new DocumentLoadInstrumentation(),
        new UserInteractionInstrumentation(),
        new XMLHttpRequestInstrumentation({
          propagateTraceHeaderCorsUrls: [
            /localhost:.*/,
            /api\/.*/
          ]
        }),
        new FetchInstrumentation({
          propagateTraceHeaderCorsUrls: [
            /localhost:.*/,
            /api\/.*/
          ]
        })
      ]
    });
  }

  getTracer(name: string) {
    return trace.getTracer(name);
  }

  startSpan(name: string) {
    return this.getTracer('ltams-frontend').startSpan(name);
  }
} 