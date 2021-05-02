import * as express from "express";
import * as bodyParser from "body-parser";
import registerRoutes from "./configuration/registerRoutes"; 
import * as cors from "cors";  
import { swaggerDocument } from "./api-doc";
import { notFoundErrorHandler, errorHandler } from "./middlewares/apiErrorHandler"; 
var swaggerUi = require('swagger-ui-express');
import * as swaggerJSDoc from 'swagger-jsdoc';  

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
        this.app.use(notFoundErrorHandler)
        this.app.use(errorHandler);
        console.log(__filename);
    } 

    private JSDocOptions = {
        // Swagger api doc meta data definitions
        swaggerDefinition : swaggerDocument,
        // Paths to files containing OpenAPI definitions
        apis: ["./dist/models/jsdoc-components.js","./dist/routes/*.js"],
      };

    private config(): void {
        this.app.use(cors())
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));  
        const swaggerSpec = swaggerJSDoc(this.JSDocOptions);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); 
    }
 
}

export default new App().app;
