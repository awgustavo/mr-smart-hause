import { IBaseService, IMessageBroker, ReadingDTO } from 'readings-commons'

export class ReadingService implements IBaseService<ReadingDTO, string> {
    private queueURL: string
    
    constructor(public broker: IMessageBroker<ReadingDTO>) {
        this.queueURL = process.env['READINGS_QUEUE'] || ''
    }

    async sendReading(readingData: ReadingDTO) {
        if (!this.isValid(readingData)) return
        
        const result = await this.broker.sendMessage(readingData, this.queueURL)
        return result
    }

    isValid({ tag, timestamp, type, value }: ReadingDTO): boolean {
        const validReading: boolean = (tag 
            && timestamp 
            && type 
            && value != undefined)
        return validReading
    }
}