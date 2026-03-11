import { createStorageClient } from '@example/storage';
import { env } from './env';

export const storage = createStorageClient({
  region: env.AWS_REGION,
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  bucket: env.S3_BUCKET,
  endpoint: env.S3_ENDPOINT,
});
