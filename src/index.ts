import * as dotenv from "dotenv";
import { z } from "zod";
import { auth } from "./auth";
import { greet } from "./greet";
import { listUsers } from "./user";

dotenv.config();

console.log(`${greet("exp-soracom")}`);
console.log();

const envSchema = z.object({
  authKeyId: z.string(),
  authKey: z.string(),
});
const env = envSchema.safeParse({
  authKeyId: process.env.SORACOM_AUTH_KEY_ID,
  authKey: process.env.SORACOM_AUTH_KEY_SECRET,
});
if (!env.success) {
  throw new Error(env.error.message);
}

const { authKeyId, authKey } = env.data;
console.log(`SORACOM_AUTH_KEY_ID=${authKeyId}`);
console.log(`SORACOM_AUTH_KEY_SECRET=${authKey}`);
console.log();

const main = async () => {
  const { operatorId, token, apiKey } = await auth({ authKeyId, authKey });
  const users = await listUsers({ operatorId, token, apiKey });

  users
    .sort((a, b) => a.createDateTime - b.createDateTime)
    .forEach((user, i) => {
      console.log(
        `${i + 1}\t${user.userName.padStart(20)}\t${new Date(
          user.createDateTime * 1000
        ).toLocaleString()}${user.description ? "\t" + user.description : ""}`
      );
    });
};

main().catch((err) => {
  console.log(err);
});
