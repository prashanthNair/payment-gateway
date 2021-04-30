import { Request, Response, NextFunction } from "express"; 
import { IAuthService } from "../services/IAuthService";
import { AuthService } from "../services/authService";
import { HttpResponseMessage } from "../utils/httpResponseMessage";


export class AuthController {
  private constructor() {}

  private static instance: AuthController = null;
  private authService = null;
 
  public static getInstance(
    authService: IAuthService = AuthService.getInstance()
  ) {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    AuthController.instance.authService = authService; // mock service Object is passed as a param from .spec
    return AuthController.instance;
  }

   
  public async getdetails(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.authService.getUsers(0); // :TODO remove hardcode
      if (result) {
        HttpResponseMessage.successResponseWithData(res, "Sucessfull", result);
      } else {
        HttpResponseMessage.sendErrorResponse(res, "Transaction Failed");
      }
    } catch (err) {
      HttpResponseMessage.sendErrorResponse(res, err);
    }
  }
 
}
