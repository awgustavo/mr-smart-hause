
import { ReadingModule } from '@application/reading/reading-persistence.module'
import { Context, SQSEvent } from 'aws-lambda'
import { ReadingDTO } from 'readings-commons'


const runReadingsPersistence = async (body) => {
    const payload = JSON.parse(body || '{}')
    const result = await ReadingModule.service.saveReading(payload as ReadingDTO)
    return result
}

export const handler = async (event: SQSEvent, context: Context) => {
    const promise = new Promise((resolve, reject) => {
        console.log(`Function started: ${ context.awsRequestId }`)
        const record = event.Records.shift()
        const { body } = record
        runReadingsPersistence(body)
            .then(() => {
                console.log('Data saved')
                resolve({
                    statusCode: 200,
                    body: JSON.stringify({})
                })
            }).catch((error) => {
                console.log('error', error)
                reject({
                    statusCode: 500,
                    body: JSON.stringify(error)
                })
            })
    })
    return promise
}