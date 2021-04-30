import { Request, Response, NextFunction } from "express"; 
import { AuthController } from "../controllers/authController"; 



const authRoutes = (
  app,
  authController: AuthController = AuthController.getInstance(), 
) => {  
  app
    .route("/")
    .get(
       (req: Request, res: Response, next: NextFunction) =>
        res.send("Welcome")
      );
    
};

export default authRoutes;
