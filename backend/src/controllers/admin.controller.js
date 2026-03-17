import * as adminService from "../services/admin.service.js";

export async function getRolesPermissions(req, res, next) {
  try {
    const roles = await adminService.getRolesPermissions(req.user);

    res.json({
      roles,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateRolePermissions(req, res, next) {
  try {
    const updatedRole = await adminService.updateRolePermissions({
      currentUser: req.user,
      role: req.params.role,
      permissions: req.body.permissions,
    });

    res.json({
      role: updatedRole,
    });
  } catch (err) {
    next(err);
  }
}