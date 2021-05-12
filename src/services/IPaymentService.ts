import { BooleanModel } from "aws-sdk/clients/gamelift";
import {InitialOrder, Order, PostPayment, UpdateOrder} from "../models/payment";

export interface IPaymentService {
    createOrder(orderData: Order): Promise<any>,
    verifySignature(orderId: String, paymentId: String, signature: String): Boolean,
    updateOrder(orderData: UpdateOrder): Promise<any>,
    postPayment(paymentData: PostPayment): Promise<any>
}