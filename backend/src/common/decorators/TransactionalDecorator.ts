import { DataSource, QueryRunner } from 'typeorm';

export function Transactional() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Ensure DataSource is available in class
      const dataSource: DataSource = this.dataSource || this['dataSource'];
      if (!dataSource) {
        throw new Error('DataSource not found in class instance');
      }

      const queryRunner: QueryRunner = dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Inject queryRunner into method args
        const result = await originalMethod.apply(this, [
          ...args,
          queryRunner.manager,
        ]);
        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    };

    return descriptor;
  };
}
