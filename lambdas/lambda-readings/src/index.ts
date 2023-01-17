import { ReadingDTO } from 'readings-commons'
import { ReadingModule } from '@application/reading/reading.module'
import { Context, APIGatewayEvent } from 'aws-lambda'


export const handler = async (event: APIGatewayEvent, context: Context) => {
    try {
        console.log(`Function started(Readings): ${ context.awsRequestId }`)
        const payload = JSON.parse(event.body || '{}')
        await ReadingModule.service.sendReading(payload as ReadingDTO)
        console.log('Message sent.')
        return {
            statusCode: 200,
            body: JSON.stringify(payload)
        }
    }
    catch (error) {
        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }
}