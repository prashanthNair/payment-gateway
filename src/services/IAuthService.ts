import { User } from "../models/user";

export interface IAuthService {  
    getUsers(userId: string, password: string): Promise<User>
}