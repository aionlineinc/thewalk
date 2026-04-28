import type { UserRole } from "@prisma/client";

export type UserDTO = {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt?: Date;
};

