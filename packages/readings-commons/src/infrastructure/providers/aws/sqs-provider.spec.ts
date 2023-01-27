import * as AWS from 'aws-sdk'
import { CustomError } from '@shared/errors/custom.error'
import { SQSProvider } from './sqs-provider'

type TestMessage =  {
    tag: string
    id: string
}
const item: TestMessage = { tag:'test' , id: 'akjsdffglkasndfklop29043r' }

jest.mock('aws-sdk', () => {
    class mockSQS {
        sendMessage(itemToAdd: AWS.SQS.SendMessageRequest) {
            return {
                async promise() {
                    if (!Object.entries(itemToAdd).length) throw new CustomError('', '', '')
                    return itemToAdd.MessageBody
                }
            }
        }
    }
    return {
        SQS: mockSQS,
    }
})
const sqs = new AWS.SQS({ apiVersion: '2012-11-05', region: 'us-east-1' })

const sqsProvider = new SQSProvider(sqs)


describe('given the sqs provider', () => {
    it('should parse sqs message', () => {
        const reading: TestMessage = { tag:'teste' , id: 'akjsdffglkasndfklop29043r' }
        const sqsMessage = sqsProvider.parseMessage(reading, 'queue_url')
        expect(sqsMessage.QueueUrl).toBeDefined()
        expect(sqsMessage.MessageBody).toBeDefined()
    })

    // it('should send a new message to sqs', async () => {
    //     const result = await sqsProvider.sendMessage(item, 'queue_url')
    //     expect(result).toBeDefined()
    //     expect((result as TestMessage).tag).toBe('test')
    // })

    // it('should throw error case sending a null message to sqs', async () => {
    //     let error
    //     try {
    //         await sqsProvider.sendMessage(undefined, 'queue_url')
    //     }
    //     catch (err) {
    //         error = err
    //     }

    //     expect(error).toBeDefined()
    //     expect(error.name).toBe('DynamoError')
    // })
})