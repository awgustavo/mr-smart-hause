
import ReadingRepository from '@infrastructure/repository/reading.repository'
import {  ReadingDTO, } from 'readings-commons'

export class ReadingPersistenceService {
    private tableName: string
    constructor(private databaseRepo: ReadingRepository) {
        this.tableName = process.env['READINGS_TABLE_NAME']
    }

    async saveReading(readingData: ReadingDTO) {
        const result = await this.databaseRepo.saveReading(readingData, this.tableName)
        return result
    }
 
}