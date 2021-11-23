import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput
} from "@aws-sdk/client-s3";

import { appConfig } from "../configs";

const s3Bucket: S3Client = new S3Client({
  region: appConfig.AWS_REGION
});

export const s3BucketUpload = async (
  filePath: string,
  fileType: string,
  buffer: Buffer
): Promise<void> => {
  await s3Bucket.send(
    new PutObjectCommand({
      Bucket: appConfig.AWS_BUCKET,
      Body: buffer,
      Key: filePath,
      ContentType: fileType
    })
  );
};

export const s3BucketDownload = async (
  filePath: string
): Promise<GetObjectCommandOutput> => {
  const data = await s3Bucket.send(
    new GetObjectCommand({
      Bucket: appConfig.AWS_BUCKET,
      Key: filePath
    })
  );

  return data;
};
