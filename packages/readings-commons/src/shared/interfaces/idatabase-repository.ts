export interface IDatabaseRepository<TEntity> {
    save(entity: TEntity, table: string): Promise<TEntity>;
}