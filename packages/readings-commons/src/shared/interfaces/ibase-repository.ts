// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBaseRepository<Entity, IdType> {
    save?: (entity: Entity, id: IdType) => Entity
    saveAll?: (entity: Entity[]) => Entity
    getById?: (id: IdType) => Entity
    getByFilter?: (entityFilter: Entity) => Entity
    delete?: (id: IdType) => Entity
}