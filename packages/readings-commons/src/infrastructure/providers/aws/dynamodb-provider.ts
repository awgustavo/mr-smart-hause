
import { IDatabaseRepository } from '../../../shared/interfaces/idatabase-repository'
import * as AWS from 'aws-sdk'
import { CustomError } from '../../../shared/errors/custom.error'

export class DynamoDBProvider<TEntity> implements IDatabaseRepository<TEntity> {
   

    constructor(private ddb: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })) {
      
    }

    public async save(object: TEntity, tableName: string):Promise<TEntity> {
        try {
            const item = this.parseItem(object, tableName)
            const result = await this.ddb.put(item).promise()
            return result as TEntity
        }
        catch (error) {
            console.log('error', error)
            throw new CustomError('DynamoError', error.message, error.stack)
        }
    }

    public parseItem(entity: TEntity, tableName: string): AWS.DynamoDB.DocumentClient.PutItemInput {
        return {
            TableName: tableName, 
            Item: { ...entity }
        }
    }
}