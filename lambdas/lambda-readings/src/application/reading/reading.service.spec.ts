
import { SQSProvider } from 'readings-commons'
import { ReadingService } from './reading.service'

describe('given the readings service', () => {

    it('should validate the reading', () => {
        const isReadingValid = new ReadingService(new SQSProvider()).isReadingValid({
            tag: 'XPTO',
            value: 12.3,
            timestamp: new Date(2022, 10, 10),
            type: 'analog'
        })
        expect(isReadingValid).toBeTruthy()    
    })
})