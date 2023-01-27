import { IDatabaseRepository, ReadingDTO } from 'readings-commons'
import * as crypto from 'crypto'
export default class ReadingRepository {

    constructor(private database: IDatabaseRepository<ReadingDTO>) {}

    async saveReading(entity:ReadingDTO, table: string) {
        entity.id = crypto.randomUUID()
        const result = await this.database.save(entity, table)
        return result
    }
}