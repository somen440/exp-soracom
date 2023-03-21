import { z } from "zod";

interface ListUsersProps {
  operatorId: string;
  apiKey: string;
  token: string;
}

const AuthKeyResponseSchema = z.object({
  authKeyId: z.string(),
  createDateTime: z.number(),
  lastUsedDateTime: z.number().optional(),
});

const ListRolesResponseSchema = z.object({
  roleId: z.string(),
  description: z.string().optional(),
  createDateTime: z.number(),
  updateDateTime: z.number().optional(),
});

const UserDetailResponseSchema = z.object({
  userName: z.string(),
  description: z.string().optional(),
  permission: z.string().optional(),
  authKeyList: AuthKeyResponseSchema.array(),
  roleList: ListRolesResponseSchema.array(),
  hasPassword: z.boolean(),
  createDateTime: z.number(),
  updateDateTime: z.number(),
});

const ListUsersResponseSchema = UserDetailResponseSchema.array();
type ListUsersResponse = z.infer<typeof ListUsersResponseSchema>;

// ref. https://developers.soracom.io/en/api/#!/User/listUsers
export const listUsers = async ({
  operatorId,
  apiKey,
  token,
}: ListUsersProps): Promise<ListUsersResponse> => {
  const res = await fetch(
    new URL(`https://api.soracom.io/v1/operators/${operatorId}/users`),
    {
      headers: {
        accept: "application/json;charset=UTF-8",
        "x-soracom-api-key": apiKey,
        "x-soracom-token": token,
      },
    }
  );
  if (!res.ok) {
    throw new Error(`res.status: ${res.status}`);
  }
  return ListUsersResponseSchema.parse(await res.json());
};
