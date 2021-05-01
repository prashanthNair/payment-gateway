export interface InitialOrder {
    "amount": Number,
    "currency": String,
    "receipt": String,
    "notes": Object
}

export interface Order {
    "orderId": String,
    "userId": Number,
    "amount": Number,
    "currency": String,
    "notes": Object,
}