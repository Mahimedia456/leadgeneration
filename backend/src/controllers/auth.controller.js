import * as authService from "../services/auth.service.js";

export async function login(req, res, next) {
  try {
    const result = await authService.loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const result = await authService.sendForgotPasswordOtp(req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function verifyOtp(req, res, next) {
  try {
    const result = await authService.verifyForgotPasswordOtp(req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const result = await authService.resetPassword(req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function meWorkspaces(req, res, next) {
  try {
    const workspaces = await authService.getUserWorkspaces(req.user);
    return res.status(200).json({ workspaces });
  } catch (error) {
    next(error);
  }
}