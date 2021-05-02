import { Request, Response, NextFunction } from "express"; 
import { IPaymentService } from "../services/IPaymentService";
import { PaymentService } from "../services/paymentService";
import { HttpResponseMessage } from "../utils/httpResponseMessage";
import {InitialOrder, Order} from "../models/payment";
import * as Razorpay from 'razorpay';
import * as dotenv from 'dotenv';

dotenv.config();

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

function randomString (strLength, charSet? ) {
    var result = [];

    strLength = strLength || 5;
    charSet = charSet ||"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    while (--strLength) {
        result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
    }

    return result.join('');
}

export class PaymentController {
    private constructor() {};

    private static instance: PaymentController = null;
    private paymentService = null;

    public static getInstance(
        paymentService: IPaymentService = PaymentService.getInstance()
    ) {
        if (!PaymentController.instance) {
            PaymentController.instance = new PaymentController();
        }
        PaymentController.instance.paymentService = paymentService; // mock service Object is passed as a param from .spec
        return PaymentController.instance;
    }

    public creteOrder(req: Request, res: Response, next: NextFunction){

        let { userId, amount, currency, notes } = req.body;

        let receiptId = userId + randomString(5);

        let initOrder: InitialOrder = {
            amount,
            currency,
            receipt: receiptId, 
            notes: notes
        }

         instance.orders.create(initOrder, async(err, createdOrder) => {
             if(err) {
                 console.log('1', err);
                 HttpResponseMessage.sendErrorResponse(res, err.message, err);
             }
             console.log('order complete: ', createdOrder);

             let orderData: Order = {
                 orderId: createdOrder.id,
                 userId: userId,
                 amount: createdOrder.amount,
                 currency: createdOrder.currency,
                 notes: createdOrder.notes
             }
             const result = await this.paymentService.createOrder(orderData);
             if (result) {
                 HttpResponseMessage.successResponseWithData(res, "Sucessfull", result);
             } else {
                 HttpResponseMessage.sendErrorResponse(res, "Transaction Failed");
             }
         });

    };
}