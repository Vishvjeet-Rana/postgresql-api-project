import { z } from "zod";

// update user profile (PUT /api/profile)
export const updateProfileSchema = {
  body: z.object({
    name: z.string().min(5, "Name must have at least 5 characters").optional(),
    email: z.string().email("Invalid email").optional(),
  }),
};

// upload profile picture
export const uploadProfilePictureSchema = {
  bosy: z.object({
    // leaving empty, multer can handle validation, if empty then no file will be uploaded. User might don't want to upload
  }),
};
