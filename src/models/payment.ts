export interface InitialOrder {
    "amount": Number,
    "currency": String,
    "receipt": String,
    "notes": Object
}

export interface Order {
    "orderId": String,
    "userId": Number,
    "status": String,
    "amount": Number,
    "currency": String,
    "notes": Object,
}

export interface UpdateOrder {
    "orderId": String,
    "orderStatus": String,
    "notes": Object
}

export interface PostPayment {
    "userId": Number,
    "orderId": String,
    "paymentId": String,
    "amount": Number,
    "currency": String,
    "paymentMode": String,
    "paymentStatus": String,
    "paymentOrigin": String,
    "description": String
}

export interface UpdatePayment{
    "paymentId": String,
    "paymentStatus": String,
    "description": String
}   

// export interface PaymentCaptureObject {
//     "userId": String,
//     "orderId": String,
//     "paymentId": String,
//     "amount": Number,
//     "currency": String
// }