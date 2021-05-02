import authRoutes from "../routes/auth";   
import paymentRoutes from "../routes/payment";   

export default function registerRoutes( app ) { 
    authRoutes(app),
    paymentRoutes(app)
}