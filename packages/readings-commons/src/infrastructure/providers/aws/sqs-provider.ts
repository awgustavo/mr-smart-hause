
import * as AWS from 'aws-sdk'
import { IMessageBroker } from '../../../shared/interfaces/imessage-broker'
import { CustomError } from '../../../shared/errors/custom.error'


export class SQSProvider<TMessageType> implements IMessageBroker<TMessageType> {

    constructor(private sqs = new AWS.SQS({ apiVersion: '2012-11-05', region: 'us-east-1' })) {}

    public async sendMessage(message: TMessageType, sqsURL:string): Promise<TMessageType> {
        try {
            const data = await this.sqs.sendMessage(this.parseMessage(message, sqsURL)).promise()
            return data as TMessageType
        }
        catch (error) {
            throw new CustomError('SQS-ERROR', `Reported error was: ${error.message}`, error.stack)
        }
    }

    public parseMessage(message: TMessageType, sqsURL: string): AWS.SQS.SendMessageRequest {
        return {
            DelaySeconds: 0,
            MessageBody: JSON.stringify(message),
            QueueUrl: sqsURL,
        }
    }
}