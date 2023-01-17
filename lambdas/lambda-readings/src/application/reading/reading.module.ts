import { ReadingDTO, SQSProvider } from 'readings-commons'
import { ReadingService } from './reading.service'

export const ReadingModule = {
    service: new ReadingService(new SQSProvider<ReadingDTO>())
}