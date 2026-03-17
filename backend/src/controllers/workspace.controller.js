import * as workspaceService from "../services/workspace.service.js";

export async function getMyWorkspaces(req, res, next) {
  try {
    const workspaces = await workspaceService.listWorkspacesForUser(req.user);

    return res.status(200).json({
      workspaces,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllWorkspaces(req, res, next) {
  try {
    const workspaces = await workspaceService.listAllWorkspaces();

    return res.status(200).json({
      workspaces,
    });
  } catch (error) {
    next(error);
  }
}

export async function getWorkspaceById(req, res, next) {
  try {
    const workspace = await workspaceService.getWorkspaceById(
      req.params.workspaceId,
      req.user
    );

    return res.status(200).json({
      workspace,
    });
  } catch (error) {
    next(error);
  }
}

export async function createWorkspace(req, res, next) {
  try {
    const workspace = await workspaceService.createWorkspace({
      name: req.body.name,
      metaBusinessName: req.body.metaBusinessName,
      description: req.body.description,
      industry: req.body.industry,
      primaryContactEmail: req.body.primaryContactEmail,
      logoUrl: req.body.logoUrl,
      brandColor: req.body.brandColor,
      region: req.body.region,
      timezone: req.body.timezone,
      createdBy: req.user?.sub || null,
    });

    return res.status(201).json({
      message: "Workspace created successfully",
      workspace,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateWorkspace(req, res, next) {
  try {
    const workspace = await workspaceService.updateWorkspace(
      req.params.workspaceId,
      req.body,
      req.user
    );

    return res.status(200).json({
      message: "Workspace updated successfully",
      workspace,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteWorkspace(req, res, next) {
  try {
    const result = await workspaceService.deleteWorkspace(
      req.params.workspaceId,
      req.user
    );

    return res.status(200).json({
      message: "Workspace deleted successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function addWorkspaceMember(req, res, next) {
  try {
    const member = await workspaceService.addUserToWorkspace({
      userId: req.body.userId,
      workspaceId: req.params.workspaceId,
      memberRole: req.body.memberRole || "workspace_editor",
      createdBy: req.user?.sub || null,
    });

    return res.status(201).json({
      message: "User added to workspace successfully",
      member,
    });
  } catch (error) {
    next(error);
  }
}

export async function getWorkspaceMembers(req, res, next) {
  try {
    const members = await workspaceService.listWorkspaceMembers(
      req.params.workspaceId,
      req.user
    );

    return res.status(200).json({
      members,
    });
  } catch (error) {
    next(error);
  }
}