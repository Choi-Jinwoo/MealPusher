import 'dotenv/config';
import { Service } from 'typedi';

@Service()
export class DotEnv {

  get(key: string): string {
    const value = process.env[key];
    if (value === undefined) {
      throw new Error(`NODE_ENV ERROR: ${key} must be defined`);
    }

    return value;
  }

}