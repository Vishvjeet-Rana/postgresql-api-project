import { Request, Response } from "express";
import { ProfileService } from "../services/profileServices";
const profileService = new ProfileService();

export class ProfileController {
  constructor(private profileService: ProfileService) {}

  public getProfile = async (req: Request, res: Response) => {
    const user = await this.profileService.getProfileService(req.user.id);

    res.status(200).json(user);
  };

  public updateProfile = async (req: Request, res: Response) => {
    const { name, email } = req.body;

    try {
      const updatedUser = await this.profileService.updateProfileService(
        req.user.id,
        name,
        email
      );

      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  public uploadProfilePicture = async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: "Profile picture not uploaded" });
    }

    const { user, filePath } =
      await this.profileService.uploadProfilePictureService(
        req.user.id,
        req.file.filename
      );

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePicture: filePath,
      user: {
        user,
      },
    });
  };
}
