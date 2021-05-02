import {InitialOrder, Order} from "../models/payment";

export interface IPaymentService {
    createOrder(orderData: Order): Promise<Order>
}