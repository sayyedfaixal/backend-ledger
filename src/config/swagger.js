const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "BankingLedger API",
    description:
      "Documentation for the Authentication and Account management endpoints of BankingLedger.",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development",
    },
  ],
  tags: [
    {
      name: "Auth",
      description: "Register and login users",
    },
    {
      name: "Accounts",
      description: "Account creation and balance APIs",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      RegisterRequest: {
        type: "object",
        required: ["email", "name", "password"],
        properties: {
          email: { type: "string", format: "email" },
          name: { type: "string" },
          password: { type: "string", minLength: 6 },
        },
        example: {
          email: "ashkumsayed@gmail.com",
          name: "Ashkum",
          password: "superSecret123",
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
        example: {
          email: "ashkumsayed@gmail.com",
          password: "superSecret123",
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              _id: { type: "string" },
              name: { type: "string" },
              email: { type: "string", format: "email" },
            },
          },
          token: { type: "string" },
        },
      },
      Account: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string" },
          status: { type: "string", enum: ["ACTIVE", "FROZEN", "CLOSED"] },
          currency: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      AccountsResponse: {
        type: "object",
        properties: {
          accounts: {
            type: "array",
            items: { $ref: "#/components/schemas/Account" },
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "User created and JWT returned",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "422": {
            description: "Email already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login with email and password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Authenticated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/accounts/": {
      post: {
        tags: ["Accounts"],
        summary: "Create a new account for the authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": {
            description: "Account created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Account" },
              },
            },
          },
          "401": {
            description: "Missing or invalid token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/accounts/get-all-accounts": {
      get: {
        tags: ["Accounts"],
        summary: "List all accounts owned by the authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Accounts retrieved",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AccountsResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized access",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/accounts/balance/{accountId}": {
      get: {
        tags: ["Accounts"],
        summary: "Get balance for a specific account",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "accountId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ObjectId of the account",
          },
        ],
        responses: {
          "200": {
            description: "Balance returned",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    accountId: { type: "string" },
                    balance: { type: "number" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Account not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/accounts/{accountId}": {
      get: {
        tags: ["Accounts"],
        summary: "Get a single account by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "accountId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Account ObjectId",
          },
        ],
        responses: {
          "200": {
            description: "Account document returned",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Account" },
              },
            },
          },
          "404": {
            description: "Account not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};

export default swaggerDocument;
