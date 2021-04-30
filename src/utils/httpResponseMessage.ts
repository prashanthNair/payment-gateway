import Logger from "./logger";
import { HttpResponse } from "./httpResponse";
import { Response } from 'express'; 

export class HttpResponseMessage {

    /**
     * Sccuess Response 
     *
     * @param  {string}   message
     * @param  {object}   res
     */

    public static successResponse(res: Response, message: string) { 
        let resData = new HttpResponse();
        resData = { success: true, status: 1, message, data: [] };
        Logger.error(resData.message);
        return res.status(200).json(resData);
    };

     /**
     * Sccuess Response with Data
     *
     * @param  {object}   res
     * @param  {string}   message
     * @param  {object}   data
     */
    
    public static async successResponseWithData(res: Response, message: string, data: object) {

        let resData = new HttpResponse();
        resData = { success: true, status: 1, message, data };  
       return res.status(200).json(resData);

    };

     /**
     * Error Response
     *
     * @param  {object}   res
     * @param  {string}   message
     */

    public static sendErrorResponse(res: Response, message: string,error?:any) {

        let resData = new HttpResponse();
        
        resData = {
            success: false, status: 0, message, error: {
                code: 500,
                message: message,
                stackTrace:error,
                params:error
            }, data: []
        };
        Logger.error(resData.message);
        console.log(resData); 
       return res.status(500).json(resData);
    };

    /**
     * Not Found Erro Response
     *
     * @param  {object}   res
     * @param  {string}   message
     */
    public static notFoundResponse(res: Response, message: string) {

        let resData = new HttpResponse();
        resData = {
            success: false, status: 0, message, error: {
                code:404,
                message: 404,
            }, data: {}
        };
        Logger.error(message)
        return res.status(404).json({});
    };

    /**
     * Not Found Erro Response
     *
     * @param  {object}   res
     * @param  {string}   message
     */
    public static validationErrorWithData(res: Response, message: string, data: object) {
        let resData = new HttpResponse();
        resData = {
            success: false, status: 0, message, error: {
                code: 400,
                message: 'BAD_REQUEST',
            }, data
        };
        Logger.error(resData.message)
        return res.status(400).json(resData);
    };
}