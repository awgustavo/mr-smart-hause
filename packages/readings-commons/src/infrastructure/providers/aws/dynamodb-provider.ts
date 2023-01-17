
import { IDatabaseRepository } from '../../../shared/interfaces/idatabase-repository'
import * as AWS from 'aws-sdk'

export class DynamoDBProvider<TEntity> implements IDatabaseRepository<TEntity> {
    private ddb: AWS.DynamoDB.DocumentClient

    public async save(object: TEntity, tableName: string):Promise<TEntity> {
        try {
            console.log('Start Dynamo')
            this.ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })
            const item = this.parseItem(object, tableName)
            console.log('item', item)
            const result = await this.ddb.put(item).promise()
            console.log('result', result)
            return object
        }
        catch (error) {
            console.log('error', error)
        }
        console.log('finally')


    }

    public parseItem(entity: TEntity, tableName: string): AWS.DynamoDB.DocumentClient.PutItemInput {
        return {
            TableName: tableName, 
            Item: { ...entity }
        }
    }
}