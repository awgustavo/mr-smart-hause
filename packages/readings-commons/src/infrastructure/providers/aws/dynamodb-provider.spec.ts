import { ReadingDTO } from '@shared/dtos/reading.dto'
import { DynamoDBProvider } from './dynamodb-provider'

describe('given the dynamodb provider', () => {
    it('should parse dynamodb item', () => {
        const reading: ReadingDTO = { tag:'teste' , id: 'akjsdffglkasndfklop29043r', value: 12.2, timestamp: new Date(), type: 'analog' }
        const dynamoParsedItem = new DynamoDBProvider().parseItem(reading, 'TableName')
        console.log(dynamoParsedItem)
        expect(dynamoParsedItem.Item.tag).toBeDefined()
    })
})