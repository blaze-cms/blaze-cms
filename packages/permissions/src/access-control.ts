import type { Role, Permission, PermissionAction, AccessCheck } from "./types.js";

export class AccessControl {
  private roles = new Map<string, Role>();

  registerRole(role: Role): void {
    this.roles.set(role.name, role);
  }

  removeRole(name: string): void {
    this.roles.delete(name);
  }

  getRole(name: string): Role | undefined {
    return this.roles.get(name);
  }

  getAllRoles(): Role[] {
    return Array.from(this.roles.values());
  }

  can(roleName: string, action: PermissionAction, collection?: string): AccessCheck {
    const role = this.roles.get(roleName);
    if (!role) {
      return { allowed: false, reason: `Role '${roleName}' not found` };
    }

    for (const permission of role.permissions) {
      if (this.matchPermission(permission, action, collection)) {
        return { allowed: true };
      }
    }

    return { allowed: false, reason: `No permission for '${action}' on '${collection ?? "*"}'` };
  }

  canAll(roleName: string, actions: PermissionAction[], collection?: string): AccessCheck {
    for (const action of actions) {
      const result = this.can(roleName, action, collection);
      if (!result.allowed) return result;
    }
    return { allowed: true };
  }

  filterAllowedFields(
    roleName: string,
    action: PermissionAction,
    collection: string,
    fields: string[],
  ): string[] {
    const role = this.roles.get(roleName);
    if (!role) return [];
    if (this.can(roleName, action, collection).allowed) return fields;

    const allowedFields: string[] = [];
    for (const field of fields) {
      for (const permission of role.permissions) {
        if (
          this.matchPermission(permission, action, collection) &&
          (!permission.fields || permission.fields.includes(field))
        ) {
          allowedFields.push(field);
          break;
        }
      }
    }
    return allowedFields;
  }

  private matchPermission(
    permission: Permission,
    action: PermissionAction,
    collection?: string,
  ): boolean {
    const actions = Array.isArray(permission.action) ? permission.action : [permission.action];
    if (!actions.includes(action) && !actions.includes("*" as PermissionAction)) {
      return false;
    }
    if (
      permission.collection &&
      permission.collection !== collection &&
      permission.collection !== "*"
    ) {
      return false;
    }
    return true;
  }
}
