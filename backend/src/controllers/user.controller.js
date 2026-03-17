import * as userService from "../services/user.service.js";

export async function listUsers(req, res, next) {
  try {
    const users = await userService.listUsersForUser(req.user);

    res.json({
      users,
    });
  } catch (err) {
    next(err);
  }
}

export async function getUser(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.userId, req.user);

    res.json({
      user,
    });
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body, req.user);

    res.status(201).json({
      user,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = await userService.updateUser(
      req.params.userId,
      req.body,
      req.user
    );

    res.json({
      user,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const result = await userService.deleteUser(req.params.userId, req.user);

    res.json(result);
  } catch (err) {
    next(err);
  }
}