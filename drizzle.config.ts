import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "singlestore",
  dbCredentials: {
    host: env.SINGLESTORE_HOST as string,
    port: env.SINGLESTORE_PORT as number,
    user: env.SINGLESTORE_USER as string,
    password: env.SINGLESTORE_PASSWORD as string,
    database: env.SINGLESTORE_DATABASE as string,
    ssl: {},
  },
  tablesFilter: ["drive-tutorial_*"],
} satisfies Config;
