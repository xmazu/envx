import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface StorageConfig {
  accessKeyId: string;
  bucket: string;
  endpoint?: string;
  region: string;
  secretAccessKey: string;
}

export function createStorageClient(config: StorageConfig) {
  const s3Client = new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    endpoint: config.endpoint,
  });

  return {
    getUploadUrl(key: string, contentType: string): Promise<string> {
      const command = new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        ContentType: contentType,
      });

      return getSignedUrl(s3Client, command, { expiresIn: 300 });
    },
  };
}

export type StorageClient = ReturnType<typeof createStorageClient>;
