import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ClientSession } from 'mongoose';

export function Transactional() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const connection: Connection = this.connection || this['connection'];
      if (!connection) {
        throw new Error('MongoDB connection not found in class instance');
      }

      const session: ClientSession = await connection.startSession();
      session.startTransaction();

      try {
        // Inject session into args if needed by downstream
        const result = await originalMethod.apply(this, [...args, session]);
        await session.commitTransaction();
        return result;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    };

    return descriptor;
  };
}
