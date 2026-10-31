const { Router } = require('express')
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const authRouter = Router()

/**
 * @route POST /api/auth/register
 */
authRouter.post("/register", authController.registerUserController)


/**
 * @route POST /api/auth/login
 */
authRouter.post("/login", authController.loginUserController)


/**
 * @route GET /api/auth/logout
 */
authRouter.get("/logout", authController.logoutUserController)


/**
 * @route GET /api/auth/get-me
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)


module.exports = authRouter