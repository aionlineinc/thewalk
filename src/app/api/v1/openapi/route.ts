import { NextResponse } from "next/server";

export async function GET() {
  // Minimal OpenAPI stub; expand per endpoint as integrations grow.
  const spec = {
    openapi: "3.0.3",
    info: {
      title: "theWalk API",
      version: "1.0.0",
    },
    servers: [{ url: "/api/v1" }],
    components: {
      securitySchemes: {
        ApiKey: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
      },
    },
    security: [{ ApiKey: [] }],
    paths: {
      "/health/db": {
        get: {
          summary: "Database health check",
          responses: {
            "200": { description: "OK" },
            "503": { description: "DB unreachable" },
          },
        },
      },
      "/scripture": {
        get: {
          summary: "Scripture lookup",
          parameters: [{ name: "ref", in: "query", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Invalid ref" },
            "404": { description: "Not found" },
          },
        },
      },
      "/groups/register": {
        post: {
          summary: "Submit group registration",
          requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
          responses: {
            "201": { description: "Created" },
            "400": { description: "Invalid input" },
          },
        },
      },
    },
  };

  return NextResponse.json(spec);
}

