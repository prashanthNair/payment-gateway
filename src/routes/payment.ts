import { Request, Response, NextFunction } from "express";
import { PaymentController } from "../controllers/paymentControllers";

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
        */
    app
        .route("/api/v1/payment/order")
        .post(async (req: Request,
            res: Response,
            next: NextFunction) =>
            await paymentController.creteOrder(req, res, next)
        );

    /**
     * @swagger
     * /api/v1/payment/verify:
     *   post:
     *     summary: Verify and capture the payment after completing the payment.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Verify_payment'
     *     responses:
     *       201:
     *         description: Payment verified successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SuccessResponse'
     *       500:
     *         $ref: '#/components/responses/FailureError'
     */
    app
        .route("/api/v1/payment/verify")
        .post(async (req: Request,
            res: Response,
            next: NextFunction) =>
            await paymentController.verifyPayment(req, res, next)
        );

    /**
    * @swagger
    * /api/v1/payment/paymentFail:
    *   post:
    *     summary: Post the failed payment datails.
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/Payment_fail'
    *     responses:
    *       201:
    *         description: Payment verified successfully
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/SuccessResponse'
    *       500:
    *         $ref: '#/components/responses/FailureError'
    */
    app
        .route("/api/v1/payment/paymentFail")
        .post(async (req: Request,
            res: Response,
            next: NextFunction) =>
            await paymentController.paymentFail(req, res, next)
        );


    /**
        * @swagger
        * /api/v1/payment/{paymentId}/refund:
        *   post:
        *     summary: Post the failed payment datails.
        *     parameters:
        *       - in: path
        *         name: paymentId
        *         required: true
        *         description: Id of the user account
        *         schema:
        *           type: integer
        *     requestBody:
        *       required: true
        *       content:
        *         application/json:
        *           schema:
        *             $ref: '#/components/schemas/Payment_fail'
        *     responses:
        *       201:
        *         description: Payment verified successfully
        *         content:
        *           application/json:
        *             schema:
        *               $ref: '#/components/schemas/SuccessResponse'
        *       500:
        *         $ref: '#/components/responses/FailureError'
        *
        */
    app
        .route("/api/v1/payment/:paymentId/refund")
        .post(async (req: Request,
            res: Response,
            next: NextFunction) =>
            await paymentController.refundPayment(req, res, next)
        );

}

export default paymentRoutes;