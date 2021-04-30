import { IAuthService } from "./IAuthService";
import { db } from "../configuration/db.config";
import { User } from "../models/user";

class AuthService implements IAuthService {
  private constructor() {} 

  private static instance: IAuthService = null;

  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async getUsers(userId: string, password: string): Promise<User> {
    try {
      let sql = `CALL storedProc(?)`;
      const [rows, fields] = await db.query(sql, userId);
      return;
    } catch (error) {
      return null;
    }
  }
  }

export { AuthService };
