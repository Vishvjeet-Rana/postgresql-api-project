import { Request, Response } from "express";
import { AdminService } from "../services/adminServices";

export class AdminController {
  constructor(private adminService: AdminService) {}

  // admin created new user
  public createUser = async (req: Request, res: Response) => {
    try {
      const { name, email } = req.body;

      const user = await this.adminService.createUserByAdminService(
        name,
        email,
        req.user.name
      );

      res.status(200).json({
        message: "User created successfully and email sent to reset password",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  };

  // get all users
  public getAllUsers = async (req: Request, res: Response) => {
    try {
      const verifiedQuery = req.query.verified as string;
      const users = await this.adminService.getAllUsersService(verifiedQuery);

      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // GET single user by Id
  public getUserById = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.adminService.getUserByIdService(userId);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // update user
  public updateUser = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const updatedUser = await this.adminService.updatedUserService(
        userId,
        req.body
      );
      res.json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  public deleteUser = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const result = await this.adminService.deleteUserService(userId);

      return res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  };

  public verifyUser = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const result = await this.adminService.verifyUserService(userId);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Verify user error:", error);
      res.status(500).json({ message: error.message });
    }
  };
}
