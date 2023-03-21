import { z } from "zod";

interface AuthProps {
  authKeyId: string;
  authKey: string;
}

const AuthResponseSchema = z.object({
  apiKey: z.string(),
  operatorId: z.string(),
  token: z.string(),
  userName: z.string(),
});
type AuthResponse = z.infer<typeof AuthResponseSchema>;

// ref. https://developers.soracom.io/en/api/#!/Auth/auth
export const auth = async ({
  authKeyId,
  authKey,
}: AuthProps): Promise<AuthResponse> => {
  const authRes = await fetch(new URL("https://api.soracom.io/v1/auth"), {
    method: "POST",
    body: JSON.stringify({ authKeyId, authKey }),
    headers: {
      "content-Type": "application/json",
    },
  });
  if (!authRes.ok) {
    throw new Error(`${authRes.status}`);
  }
  return AuthResponseSchema.parse(await authRes.json());
};
