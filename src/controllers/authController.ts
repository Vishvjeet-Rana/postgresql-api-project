import { Request, Response } from "express";
import { AuthService } from "../services/authServices";

export class AuthController {
  constructor(private authService: AuthService) {}

  // register controller
  public register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    const image = req.file?.filename;

    try {
      const user = await this.authService.registerUserService(
        name,
        email,
        password,
        image
      );
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ status: "error", message: error.message });
    }
  };

  // login controller
  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
      const { token, user } = await this.authService.loginUserService(
        email,
        password
      );

      res.status(200).json({
        message: "Logged in successfully",
        token,
        user,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // get me controller
  public getMe = async (req: Request, res: Response): Promise<void> => {
    res.json(req.user);
  };

  // forgot password controller
  public forgotPassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { email } = req.body;

    try {
      await this.authService.forgotPasswordService(email);
      res.status(200).json({ message: "Reset link sent to user via email" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // reset password controller
  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
      await this.authService.resetPasswordService(token, newPassword);
      res.status(200).json({
        message: "Password reset successfully",
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // change password controller
  public changePassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { oldPassword, newPassword } = req.body;

    try {
      await this.authService.changePasswordService(
        req.user.id,
        oldPassword,
        newPassword
      );
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
