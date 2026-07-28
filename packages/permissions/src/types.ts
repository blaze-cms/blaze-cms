export type PermissionAction = "create" | "read" | "update" | "delete" | "publish" | "unpublish";

export interface Permission {
  action: PermissionAction | PermissionAction[];
  collection?: string | undefined;
  fields?: string[] | undefined;
  condition?: string | undefined;
}

export interface Role {
  name: string;
  description?: string | undefined;
  permissions: Permission[];
}

export interface AccessCheck {
  allowed: boolean;
  reason?: string | undefined;
}
