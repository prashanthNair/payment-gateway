import { Request, Response, NextFunction } from "express";
import { IPaymentService } from "../services/IPaymentService";
import { PaymentService } from "../services/paymentService";
import { HttpResponseMessage } from "../utils/httpResponseMessage";
import { InitialOrder, Order, PostPayment, UpdateOrder, UpdatePayment } from "../models/payment";
import * as Razorpay from 'razorpay';
import * as dotenv from 'dotenv';

dotenv.config();

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

function randomString(strLength, charSet?) {
    var result = [];

    strLength = strLength || 5;
    charSet = charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    while (--strLength) {
        result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
    }

    return result.join('');
}

export class PaymentController {
    private constructor() { };

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

    public creteOrder(req: Request, res: Response, next: NextFunction) {

        let { userId, amount, currency, notes } = req.body;

        notes = typeof(notes) == "string" ? JSON.parse(notes): notes; // can comment this later.
        let receiptId = userId + randomString(5);

        let initOrder: InitialOrder = {
            amount,
            currency,
            receipt: receiptId,
            notes: notes
        }

        instance.orders.create(initOrder, async (err, createdOrder) => {
            if (err) {
                console.log('1', err);
                HttpResponseMessage.sendErrorResponse(res, err.message, err);
            }
            console.log('order complete: ', createdOrder);

            let orderData: Order = {
                orderId: createdOrder.id,
                userId: userId,
                amount: createdOrder.amount,
                currency: createdOrder.currency,
                notes: createdOrder.notes,
                status: createdOrder.status
            }
            let result = await this.paymentService.createOrder(orderData)
            if (result) {
                console.log(`order details saved to table: ${JSON.stringify(result)}`);
                HttpResponseMessage.successResponseWithData(res, "Sucessfull", orderData); // sp returning no inserted data.
            } else {
                console.log(`error in saving`);
                HttpResponseMessage.sendErrorResponse(res, "Transaction Failed");
            }
        });
    };

    public verifyPayment(req: Request, res: Response, next: NextFunction) {
        try {
            let { paymentId, orderId, userId, signature, amount, currency, paymentOrigin, notes } = req.body;

            notes = typeof (notes) == "string" ? JSON.parse(notes) : notes; // comment later
            userId = typeof (userId) == "string" ? Number(userId) : userId; // comment later

            if (this.paymentService.verifySignature(orderId, paymentId, signature)) {
                console.log(`payment verified true`);
                let updateOrderObject: UpdateOrder = {
                    orderId,
                    orderStatus: "",
                    notes: notes || { "description": "payment captured.", "userId": userId } // modify later//
                };
                let paymentData: PostPayment = {
                    userId: userId,
                    orderId: orderId,
                    paymentId: paymentId,
                    paymentStatus: "",
                    paymentMode: "",
                    paymentOrigin: paymentOrigin,
                    description: notes || { "description": "payment captured.", "userId": userId }, // {"description":"payement completed."} // dummy
                    amount,
                    currency
                }

                // if signature matches.. then capture the payment..

                let pay = instance.payments.capture(paymentId, amount, currency);
                pay.then(async resp => {
                    if (paymentId == resp.id && amount == resp.amount) {
                        console.log(`payment catptured. response: ${JSON.stringify(resp)}`);

                        updateOrderObject.orderStatus = "paid";
                        let updatedOrder = await this.paymentService.updateOrder(updateOrderObject)  // update order table under payment ms

                        paymentData.paymentStatus = resp.status;
                        paymentData.paymentMode = resp.method;
                        paymentData.description = "payment captured";
                        let postedPayment = await this.paymentService.postPayment(paymentData)

                        if (updatedOrder && postedPayment) {
                            let result = {
                                success: true,
                                updatedOrder,
                                postedPayment
                            }
                            console.log(`order details updated: ${JSON.stringify(result)}`);
                            HttpResponseMessage.successResponseWithData(res, "Sucessfull", result);
                        } else {
                            HttpResponseMessage.sendErrorResponse(res, "Transaction Failed");
                        }
                    }
                }).catch(err => {
                    console.log("capture error: ", err);

                    // on capture fail, update order status to attempted since payment verified.
                    updateOrderObject.orderStatus = "attempted"
                    updateOrderObject.notes = { "description": "capture failed" }; // modify later//

                    this.paymentService.updateOrder(updateOrderObject) // set status to attempted if capture not success.

                    let paymentInstance = instance.payments.fetch(paymentId);
                    paymentInstance.then(async pi => {
                        paymentData.paymentStatus = "authorized";
                        paymentData.paymentMode = pi.method;
                        paymentData.description = "capture failed";
                        let postedPayment = await this.paymentService.postPayment(paymentData)
                    })

                    HttpResponseMessage.sendErrorResponse(res, err);
                })

                /*
                    PAYMENT STATUS = ["created", "authorized", "captured", "refunded", "failed"]
                    ORDER STATUS = ["created", "attempted", "paid"]
                */
            } else {
                console.log(`payment verified false`);
                let updateOrderObject: UpdateOrder = {
                    orderId,
                    orderStatus: "attempted",
                    notes: { "description": "payment not verified" } // modify later//
                };
                this.paymentService.updateOrder(updateOrderObject);

                let paymentInstance = instance.payments.fetch(paymentId);
                paymentInstance.then(async pi => {
                    let paymentData: PostPayment = {
                        userId: userId,
                        orderId: orderId,
                        paymentId: paymentId,
                        paymentStatus: pi.status,
                        paymentMode: pi.method,
                        paymentOrigin: paymentOrigin,
                        description: "payment not verified", // {"description":"payement completed."} // dummy
                        amount,
                        currency
                    }
                    // let postedPayment = await this.paymentService.postPayment(paymentData)
                    this.paymentService.postPayment(paymentData)
                })
                HttpResponseMessage.sendErrorResponse(res, "Payment verification failed.");
            }

        } catch (err) {
            console.log('2: ', err);
            HttpResponseMessage.sendErrorResponse(res, err);
        }
    }

    public paymentFail(req: Request, res: Response, next: NextFunction) {
        console.log(1)
        let { paymentId, userId, orderId, notes, paymentOrigin } = req.body;

        notes = typeof (notes) == "string" ? JSON.parse(notes) : notes; // comment later

        // fetch payment details for payment_id
        instance.payments.fetch(paymentId).then(paymentObj => {
            let paymentData: PostPayment = {
                paymentStatus: paymentObj.status,
                paymentMode: paymentObj.method,
                amount: paymentObj.amount,
                currency: paymentObj.currency,
                userId,
                orderId,
                paymentId,
                paymentOrigin,
                description: notes,
            }
            let orderData: UpdateOrder = {
                orderStatus: "attempted",
                orderId,
                notes: notes,
            }
            let paymentResult = this.paymentService.postPayment(paymentData);
            let orderResult = this.paymentService.updateOrder(orderData);

            if (paymentResult && orderResult) {
                console.log(`payment, order details updated: ${JSON.stringify(paymentResult)} || ${JSON.stringify(orderResult)}`);
                HttpResponseMessage.successResponseWithData(res, "Sucessfull", {
                    payment: paymentResult,
                    order: orderResult
                });
            } else {
                HttpResponseMessage.sendErrorResponse(res, "Update Failed");
            }
        }).catch(err => {
            console.log(err);
            HttpResponseMessage.sendErrorResponse(res, err);
        })
    }

    public refundPayment(req: Request, res: Response, next: NextFunction) {
        console.log(2)

        let { paymentId } = req.params;
        let { userId, amount, notes, orderId } = req.body;

        notes = typeof (notes) == "string" ? JSON.parse(notes) : notes; // comment later

        instance.payments.refund(paymentId, { amount, notes }, async (err, payment) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('payment refund result: ', payment);
                let payData : UpdatePayment = {
                    paymentId,
                    paymentStatus: "refunded",
                    description: JSON.stringify(notes)
                }
                let result = this.paymentService.updatePayment(payData)
                
                if (result) {
                    console.log(`order details saved to table: ${JSON.stringify(result)}`);
                    HttpResponseMessage.successResponseWithData(res, "Sucessfull", result);
                } else {
                    console.log(`error in saving`);
                    HttpResponseMessage.sendErrorResponse(res, "Transaction Failed");
                }
            }
        });
    }
}