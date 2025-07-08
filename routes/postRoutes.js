import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { isAuthorOrAdmin } from "../middlewares/ownershipMiddleware.js";

import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, upload.single("image"), createPost);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all blog posts
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getAllPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a blog post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: Blog post data
 *       404:
 *         description: Post not found
 */
router.get("/:id", getPostById);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 *       403:
 *         description: Not authorized
 */
router.put("/:id", protect, isAuthorOrAdmin, updatePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       403:
 *         description: Not authorized
 */
router.delete("/:id", protect, isAuthorOrAdmin, deletePost);

export default router;
