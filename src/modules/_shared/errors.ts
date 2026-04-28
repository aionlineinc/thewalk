export type AppError =
  | { kind: "Validation"; message: string }
  | { kind: "Unauthorized"; message?: string }
  | { kind: "Forbidden"; message?: string }
  | { kind: "NotFound"; message?: string }
  | { kind: "Conflict"; message: string }
  | { kind: "Invariant"; message: string }
  | { kind: "Unexpected"; message: string };

export function validation(message: string): AppError {
  return { kind: "Validation", message };
}

export function unauthorized(message?: string): AppError {
  return { kind: "Unauthorized", message };
}

export function forbidden(message?: string): AppError {
  return { kind: "Forbidden", message };
}

export function notFound(message?: string): AppError {
  return { kind: "NotFound", message };
}

export function conflict(message: string): AppError {
  return { kind: "Conflict", message };
}

export function invariant(message: string): AppError {
  return { kind: "Invariant", message };
}

export function unexpected(message: string): AppError {
  return { kind: "Unexpected", message };
}

