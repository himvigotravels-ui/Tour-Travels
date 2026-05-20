// This Proxy client acts as an RPC gateway, sending database requests
// to the external SQLite Express server instead of direct local Postgres queries.
// It has 0MB Prisma footprint on Vercel serverless builds because it contains
// ZERO imports of @prisma/client, making your Vercel serverless functions load instantly!

// Fall back to the production Render backend so the live site still
// works even if NEXT_PUBLIC_BACKEND_URL isn't set on Vercel. Override
// locally by setting NEXT_PUBLIC_BACKEND_URL=http://localhost:3001.
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://tour-travels-backend-l6e4.onrender.com";
const API_KEY =
  process.env.BACKEND_API_KEY || "himvigo-super-secret-key-2026";

class PrismaQueryPromise {
  model: string;
  action: string;
  args: any[];

  constructor(model: string, action: string, args: any[]) {
    this.model = model;
    this.action = action;
    this.args = args;
  }

  async execute() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/prisma`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          model: this.model,
          action: this.action,
          args: this.args,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Database API error: ${response.statusText}`);
      }

      const { data } = await response.json();
      return data;
    } catch (error: any) {
      console.error(`❌ RPC Query Failed: prisma.${this.model}.${this.action}`, error);
      throw error;
    }
  }

  then(onfulfilled?: any, onrejected?: any) {
    return this.execute().then(onfulfilled, onrejected);
  }

  catch(onrejected?: any) {
    return this.execute().catch(onrejected);
  }

  finally(onfinally?: any) {
    return this.execute().finally(onfinally);
  }
}

// Transaction execution handler
async function executeTransaction(operations: PrismaQueryPromise[]) {
  try {
    const serializedOps = operations.map(op => ({
      model: op.model,
      action: op.action,
      args: op.args,
    }));

    const response = await fetch(`${BACKEND_URL}/api/prisma/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ operations: serializedOps }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Database Transaction error: ${response.statusText}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("❌ RPC Transaction Failed:", error);
    throw error;
  }
}

const makeModelProxy = (model: string) => {
  return new Proxy({}, {
    get(target, prop) {
      if (typeof prop === "string") {
        return (...args: any[]) => {
          return new PrismaQueryPromise(model, prop, args);
        };
      }
    },
  });
};

const createPrismaProxy = () => {
  return new Proxy({}, {
    get(target, prop) {
      if (typeof prop === "string") {
        if (prop === "$transaction") {
          return async (ops: any[]) => {
            return await executeTransaction(ops);
          };
        }
        if (prop === "$disconnect" || prop === "$connect") {
          return async () => {};
        }
        if (prop.startsWith("$")) {
          return (...args: any[]) => {
            console.warn(`Calling unsupported direct helper: prisma.${prop}`);
            return Promise.resolve(null);
          };
        }
        return makeModelProxy(prop);
      }
    },
  });
};

export const prisma = createPrismaProxy() as any;
export default prisma;
