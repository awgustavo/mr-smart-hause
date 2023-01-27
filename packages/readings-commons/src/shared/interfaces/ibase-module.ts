import { IBaseService } from './ibase-service'

export interface IBaseModule<Entity, IdType>  {
    service: IBaseService<Entity, IdType>
}