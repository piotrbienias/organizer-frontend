export const checkIfPermissionExists = (permissions, label) => {
    var permissionIndex = permissions.findIndex(permission => { return permission.label === label });

    return (typeof permissionIndex !== 'undefined' && permissionIndex >= 0);
}