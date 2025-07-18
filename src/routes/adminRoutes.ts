import express from "express";
import { AdminController } from "../controllers/adminController";
import { AdminService } from "../services/adminServices";
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
} from "../validators/admin.validator";

import { adminOnly } from "../middlewares/adminMiddleware";
import { protect } from "../middlewares/authMiddleware";
import { Router } from "express";

import validate from "../middlewares/validateRequest";

const router: Router = Router();

const adminService = new AdminService();
const adminController = new AdminController(adminService);

/**
 * @swagger
 * /api/admin:
 *   post:
 *     summary: Create a new user (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 */
router.post(
  "/",
  protect,
  adminOnly,
  validate(createUserSchema),
  adminController.createUser
);

/**
 * @swagger
 * /api/admin:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: verified
 *         schema:
 *           type: string
 *         description: Optional filter by isVerified (e.g. false)
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", protect, adminOnly, adminController.getAllUsers);

/**
 * @swagger
 * /api/admin/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 */
router.get(
  "/:id",
  protect,
  adminOnly,
  validate(userIdParamSchema),
  adminController.getUserById
);

/**
 * @swagger
 * /api/admin/{id}:
 *   put:
 *     summary: Update user info (name, email, role)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
router.put(
  "/:id",
  protect,
  adminOnly,
  validate(updateUserSchema),
  adminController.updateUser
);

/**
 * @swagger
 * /api/admin/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete(
  "/:id",
  protect,
  adminOnly,
  validate(userIdParamSchema),
  adminController.deleteUser
);

/**
 * @swagger
 * /api/admin/{id}/verify:
 *   patch:
 *     summary: Manually verify user account
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User verified
 *       404:
 *         description: User not found
 */
router.patch(
  "/:id/verify",
  protect,
  adminOnly,
  validate(userIdParamSchema),
  adminController.verifyUser
);

export default router;
