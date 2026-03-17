import * as invitationService from "../services/invitation.service.js";

export async function createInvitation(req, res, next) {
  try {
    const invitation = await invitationService.createInvitation({
      email: req.body.email,
      workspaceId: req.body.workspaceId,
      globalRole: req.body.globalRole || "workspace_user",
      memberRole: req.body.memberRole || "workspace_editor",
      invitedBy: req.user?.sub || null,
      expiresInDays: req.body.expiresInDays || 7,
    });

    return res.status(201).json({
      message: "Invitation created successfully",
      invitation,
    });
  } catch (error) {
    next(error);
  }
}

export async function getInvitationByToken(req, res, next) {
  try {
    const invitation = await invitationService.getInvitationByToken(req.params.token);

    return res.status(200).json({
      invitation,
    });
  } catch (error) {
    next(error);
  }
}

export async function signupWithInvitation(req, res, next) {
  try {
    const result = await invitationService.signupWithInvitation({
      inviteToken: req.body.inviteToken,
      fullName: req.body.fullName,
      password: req.body.password,
    });

    return res.status(200).json({
      message: "Account setup completed successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function revokeInvitation(req, res, next) {
  try {
    const invitation = await invitationService.revokeInvitation(req.params.invitationId);

    return res.status(200).json({
      message: "Invitation revoked successfully",
      invitation,
    });
  } catch (error) {
    next(error);
  }
}

export async function listInvitations(req, res, next) {
  try {
    const invitations = await invitationService.listInvitations({
      workspaceId: req.query.workspaceId || null,
      status: req.query.status || null,
    });

    return res.status(200).json({
      invitations,
    });
  } catch (error) {
    next(error);
  }
}