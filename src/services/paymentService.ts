import { IPaymentService } from "./IPaymentService";
import { db } from "../configuration/db.config";
import { InitialOrder, Order, PostPayment, UpdateOrder, UpdatePayment } from "../models/payment";
import * as dotenv from "dotenv";
const crypto = require("crypto");

dotenv.config();

export class PaymentService implements IPaymentService {

    private constructor() { };

    private static instance: IPaymentService = null;

    static getInstance() {
        if (!PaymentService.instance) {
            PaymentService.instance = new PaymentService();
        }
        return PaymentService.instance;
    }

    public async createOrder(orderData: Order): Promise<any>{
        try {
            let {
                orderId, userId, amount, currency, notes, status
            } = orderData;

            let sql = `CALL create_order(?,?,?,?,?,?)`;
            let result = await db.query(sql, [
                userId,
                orderId,
                amount,
                currency,
                JSON.stringify(notes),
                status
            ]);
            console.log('result: ', result);
            return orderData;
        }
        catch (err) {
            console.log(`error in createOrder: ${err}`);
            return null;
        }

    }

    public verifySignature(orderId, paymentId, signature): Boolean {

        var generatedSignature = crypto
            .createHmac(
                "SHA256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(orderId + "|" + paymentId)
            .digest("hex");
        return generatedSignature == signature;
    }

    public async updateOrder(orderData: UpdateOrder): Promise<any> {
        try {
            let {
                orderId, notes, orderStatus
            } = orderData;
            console.log(".......................", orderData);
            
            let sql = `CALL update_order(?,?,?)`;
            let result = await db.query(sql, [
                orderId,
                JSON.stringify(notes), 
                orderStatus
            ]);
            console.log(",,,,,,,,,,,,,,,,,", result)

            return result;
        }
        catch (err) {
            console.log(`error in updating order: ${err}`);
            return null;
        }
    }

    public async postPayment(payData: PostPayment) {
        try{
            let {
                paymentId, userId, orderId,
                amount, currency,
                paymentOrigin, paymentMode, paymentStatus, description
            } = payData;

            let sql = `CALL postPayment(?,?,?,?,?,?,?,?,?)`;
            let result = await db.query(sql, [
                paymentId, userId, orderId,  amount, currency, 
                paymentMode, paymentStatus, paymentOrigin, 
                JSON.stringify(description)
            ]);

            return result
        }
        catch (err) {
            console.log(`error in postPayment: ${err}`);
            return null;
        }
    }

    public async updatePayment(paymentData: UpdatePayment) {
        try {
            let { paymentId, paymentStatus, description } = paymentData;
            console.log(paymentStatus, JSON.stringify(description), paymentId)
            let sql = `CALL Update_Payment(?,?,?)`;
            let result = await db.query(sql, [
                paymentId, paymentStatus, JSON.stringify(description)
            ]);

            return result
        }
        catch (err) {
            console.log(`error in postPayment: ${err}`);
            return null;
        }
    }
}
