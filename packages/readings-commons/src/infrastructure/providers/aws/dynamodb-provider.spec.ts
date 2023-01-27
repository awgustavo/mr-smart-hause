import { ReadingDTO } from '@shared/dtos/reading.dto'
import { DynamoDBProvider } from './dynamodb-provider'
import * as AWS from 'aws-sdk'
import { CustomError } from '@shared/errors/custom.error'

type TestType =  {
    tag: string
    id: string
}
const item: TestType = { tag:'test' , id: 'akjsdffglkasndfklop29043r' }

jest.mock('aws-sdk', () => {
    class mockDocumentClient {
        put(itemToAdd) {
            return {
                async promise() {
                    if (!Object.entries(itemToAdd.Item).length) throw new CustomError('', '', '')
                    return itemToAdd.Item
                }
            }
        }
    }
    return {
        DynamoDB: {
            DocumentClient: mockDocumentClient,
        } 
    }
})
const ddb = new AWS.DynamoDB.DocumentClient()

const dynamoDBProvider = new DynamoDBProvider(ddb)


describe('given the dynamodb provider', () => {
    it('should parse dynamodb item', () => {
        const reading: ReadingDTO = { tag:'teste' , id: 'akjsdffglkasndfklop29043r', value: 12.2, timestamp: new Date(), type: 'analog' }
        const dynamoParsedItem = new DynamoDBProvider().parseItem(reading, 'TableName')
        expect(dynamoParsedItem.Item.tag).toBeDefined()
    })

    it('should put a new item to dynamodb', async () => {
        const result = await dynamoDBProvider.save(item, 'table_name')
        expect(result).toBeDefined()
        expect((result as TestType).tag).toBe('test')
    })

    it('should throw error case put a null item to dynamodb', async () => {
        let error
        try {
            await dynamoDBProvider.save(null, 'table_name')
        }
        catch (err) {
            error = err
        }

        expect(error).toBeDefined()
        expect(error.name).toBe('DynamoError')
    })
})