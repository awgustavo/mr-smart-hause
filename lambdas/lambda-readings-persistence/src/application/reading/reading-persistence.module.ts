import ReadingRepository from '@infrastructure/repository/reading.repository'
import { DynamoDBProvider, ReadingDTO } from 'readings-commons'
import { ReadingPersistenceService } from './reading-persistence.service'

export const ReadingModule = {
    service: new ReadingPersistenceService(new ReadingRepository(new DynamoDBProvider<ReadingDTO>()))
}