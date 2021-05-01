import { Request, Response, NextFunction } from 'express'; 
export interface IError {
    status?: number;
    code?: number;
    message?: string;
}

/**
 * 404 middleware to catch error response
 *
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 */
export function notFoundErrorHandler(req: Request, res: Response, next: NextFunction) {
    res.status(404)
        .json({
            success: false,
            error: {
                code: 404,
                message: 'NOT_FOUND',
            },
        });
}

/**
 * Generic error response middleware
 *
 * @param  {object}   err
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 */
export function errorHandler(err: IError, req: Request, res: Response, next: NextFunction) {
    res.status(err.status || 500)
        .json({
            success: false,
            error: {
                code: err.code || 500,
                message: err.message || 'INTERNAL_SERVER_ERROR',
            },
        });
}
