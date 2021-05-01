import {IPaymentService} from "./IPaymentService";
import {db} from "../configuration/db.config";
import {InitialOrder, Order} from "../models/payment";

export class PaymentService implements IPaymentService {

    private constructor(){};

    private static instance: IPaymentService = null;

    static getInstance() {
        if (!PaymentService.instance) {
            PaymentService.instance = new PaymentService();
        }
        return PaymentService.instance;
    }
    
    public async createOrder(orderData: Order): Promise<Order>{
        try{
            let { orderId, userId, amount, currency, notes } = orderData

            let sql = `CALL CreateOrder(?,?,?,?)`;
            let result = await db.query(sql, [
                // orderId,
                userId,
                amount,
                currency,
                JSON.stringify(notes)
            ]);
            
            return orderData;
        }
        catch(err) {
            console.log("1", err)
            return err;
        }
        
    }
}
