import * as bcrypt from 'bcrypt';

export async function encryptPassword(password: string) {
  const saltOrRounds = 10;
  return await bcrypt.hash(password, saltOrRounds);
}

export async function comparePassword(password: string, hashPassword: string) {
  return await bcrypt.compare(password, hashPassword);
}