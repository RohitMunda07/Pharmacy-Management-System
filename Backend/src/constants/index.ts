export const ROLES = {
  ADMIN: "ADMIN",
  PHARMACIST: "PHARMACIST",
} as const;

export const JWT_EXPIRES_IN = "8h";

export const DEFAULT_REORDER_LEVEL = 10;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
} as const;
