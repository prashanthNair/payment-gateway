import * as express from "express";
import * as bodyParser from "body-parser";
import registerRoutes from "./configuration/registerRoutes"; 
import * as cors from "cors";   
class App {

    public app = express(); 

    private options: cors.CorsOptions = {
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
        credentials: false,
        methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        origin: 'http://localhost:4200',
        preflightContinue: false
    };
    
    constructor() {
        this.config(); 
        registerRoutes(this.app);        
        console.log(__filename);
    } 

    private config(): void {
        this.app.use(cors())
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));  
    }
 
}

export default new App().app;
