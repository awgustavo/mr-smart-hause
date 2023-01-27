import { IBaseModule, ReadingDTO, SQSProvider } from 'readings-commons'
import { ReadingService } from './reading.service'

export const ReadingModule: IBaseModule<ReadingDTO, string> = {
    service: new ReadingService(new SQSProvider<ReadingDTO>())
}