import { IBaseRepository } from './ibase-repository'
import { IMessageBroker } from './imessage-broker'

export interface IBaseService<Entity, IdType> {
    repository?: IBaseRepository<Entity, IdType>
    broker?: IMessageBroker<Entity>
    isValid(entity: Entity): boolean
}