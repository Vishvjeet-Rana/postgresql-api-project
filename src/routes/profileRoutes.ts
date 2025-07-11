import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";
import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
} from "../controllers/profileController";
import { Router } from "express";

import { updateProfileSchema } from "../validators/profile.validator";

import validate from "../middlewares/validateRequest";

const router: Router = Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 profilePicture:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user's name or email
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put("/", protect, validate(updateProfileSchema), updateProfile);

/**
 * @swagger
 * /api/profile/upload:
 *   post:
 *     summary: Upload or change user's profile picture
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 */
router.post("/upload", protect, upload.single("profile"), uploadProfilePicture);

export default router;
