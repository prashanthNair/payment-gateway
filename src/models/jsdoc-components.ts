/**
 * @swagger
 *  components:
 *    schemas:
 *      Initial_order:
 *        type: object
 *        properties:
 *          userId:
 *            type: integer
 *            description: userId
 *          amount:
 *            type: integer
 *            description: amount of order
 *          currency:
 *            type: string
 *            description: currency of transaction
 *          receipt:
 *            type: string
 *            description: receipt name
 *          notes:
 *            type: object
 *            description: Any extra information
 */
/**
 * @swagger
 *  components:
 *    schemas:
 *      Verify_payment:
 *        type: object
 *        properties:
 *          paymentId:
 *            type: string
 *            description: razorpay payment_id returned after a payment success/failure
 *          userId:
 *            type: integer
 *            description: userId
 *          orderId:
 *            type: string
 *            description: razorpay order_id
 *          signature:
 *            type: string
 *            description: razorpay signature to be verified
 *          amount:
 *            type: integer
 *            description: amount of order
 *          currency:
 *            type: string
 *            description: currency of transaction
 *          paymentOrigin:
 *            type: string
 *            description: Origin of payment (buddy, user, brand etc)
 *          notes:
 *            type: object
 *            description: Any extra information
 */
/**
 * @swagger
 *  components:
 *    schemas:
 *      Payment_fail:
 *        type: object
 *        properties:
 *          userId:
 *            type: integer
 *            description: userId
 *          orderId:
 *            type: string
 *            description: razorpay order_id
 *          amount:
 *            type: integer
 *            description: Amount of payment
 *          notes:
 *            type: string
 *            description: Any extra information
 */
/**
 * @swagger
 *  components:
 *    schemas:
 *      SuccessResponse:
 *        type: object
 *        properties:
 *          success:
 *            type: boolean
 *            description: Tells the state of the API is success/failure
 *            example: true
 *          status:
 *            type: integer
 *            description: Indicates the status of the API transaction
 *            example: 1
 *          message:
 *            type: string
 *            description: Message about the API transaction
 *            example: Transaction successfull
 *
 */
/**
 * @swagger
 *  components:
 *    schemas:
 *      FailureResponse:
 *        type: object
 *        properties:
 *          success:
 *            type: boolean
 *            description: Tells the state of the API is success/failure
 *            example: false
 *          status:
 *            type: integer
 *            description: Indicates the status of the API transaction
 *            example: 0
 *          message:
 *            type: string
 *            description: Message about the API transaction
 *            example : Transaction Failure
 */
/**
 * @swagger
 *  components:
 *    responses:
 *      Success:
 *        description: The specified operation is completed successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SuccessResponse'
 *      FailureError:
 *        description: The specified operation failed due to internal server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/FailureResponse'
 *      BadRequest:
 *        description: Parameters are not appropriate for this API transaction. Please validate the input.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/FailureResponse'
 *
 */