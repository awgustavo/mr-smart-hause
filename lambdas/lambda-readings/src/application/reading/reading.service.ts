import { ReadingDTO, SQSProvider } from 'readings-commons'

export class ReadingService {
    private queueURL: string
    constructor(private awsProvider: SQSProvider<ReadingDTO>) {
        this.queueURL = process.env['READINGS_QUEUE'] || ''
    }

    async sendReading(readingData: ReadingDTO) {
        if (!this.isReadingValid(readingData)) return
        
        const result = await this.awsProvider.sendMessage(readingData, this.queueURL)
        return result
    }

    isReadingValid(readingData: ReadingDTO): boolean {
        const validReading: boolean = (readingData.tag && readingData.timestamp && readingData.type && readingData.value != undefined) || false
        return validReading
    }  
}