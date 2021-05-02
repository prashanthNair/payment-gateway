import { Request, Response, NextFunction } from "express";
import {PaymentController} from "../controllers/paymentControllers";

const paymentRoutes = (
    app,
    paymentController: PaymentController = PaymentController.getInstance()
) => {

/**
     * @swagger
     * /api/v1/payment/order:
     *   post:
     *     summary: Create order before product checkout.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Initial_order'
     *     responses:
     *       201:
     *         description: Order created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SuccessResponse'
     *       500:
     *         $ref: '#/components/responses/FailureError'
     *
    */
    app
        .route("/api/v1/payment/order")
        .post(async (req: Request,
            res: Response,
            next: NextFunction) => 
            await paymentController.creteOrder(req, res, next)
}

export default paymentRoutes;