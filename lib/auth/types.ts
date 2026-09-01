/**
 * lib/auth/types.ts
 *
 * Role and permission definitions for the Sustainability Credentials platform.
 * No user data — just the permission matrix.
 */

export type UserRole =
  | "viewer"
  | "contributor"
  | "reviewer"
  | "data-steward"
  | "administrator";

export type Permission =
  | "content:view"
  | "content:create"
  | "content:edit"
  | "content:review"
  | "content:publish"
  | "workbook:upload"
  | "workbook:review"
  | "workbook:publish"
  | "workbook:rollback"
  | "taxonomy:edit"
  | "export:create"
  | "reference-slide:approve"
  | "audit:view"
  | "users:manage"
  | "system:manage";

/**
 * Role → Permission matrix.
 * Each role inherits all permissions listed.
 * Permissions are checked server-side on every write.
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  viewer: [
    "content:view",
    "export:create",
  ],
  contributor: [
    "content:view",
    "content:create",
    "content:edit",
    "export:create",
  ],
  reviewer: [
    "content:view",
    "content:create",
    "content:edit",
    "content:review",
    "content:publish",
    "export:create",
    "reference-slide:approve",
  ],
  "data-steward": [
    "content:view",
    "content:create",
    "content:edit",
    "content:review",
    "content:publish",
    "workbook:upload",
    "workbook:review",
    "workbook:publish",
    "workbook:rollback",
    "taxonomy:edit",
    "export:create",
    "reference-slide:approve",
    "audit:view",
  ],
  administrator: [
    "content:view",
    "content:create",
    "content:edit",
    "content:review",
    "content:publish",
    "workbook:upload",
    "workbook:review",
    "workbook:publish",
    "workbook:rollback",
    "taxonomy:edit",
    "export:create",
    "reference-slide:approve",
    "audit:view",
    "users:manage",
    "system:manage",
  ],
};

export function roleHasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export interface SessionUser {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  /** ISO timestamp when the session expires */
  expiresAt: string;
}

/**
 * A contributor may not approve their own submitted content.
 * Pass the submitterId and the reviewerId to enforce this.
 */
export function canApproveOwnContent(_submitterId: string, _reviewerId: string): boolean {
  return false; // Contributors are never allowed to approve their own submissions.
}
