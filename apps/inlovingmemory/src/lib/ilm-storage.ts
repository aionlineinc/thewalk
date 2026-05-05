import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getIlmStorageEnv, publicUrlForStorageKey } from "@/lib/ilm-storage-config";

function getClient() {
  const env = getIlmStorageEnv();
  if (!env.configured || !env.bucket || !env.endpoint || !env.accessKeyId || !env.secretAccessKey) {
    throw new Error("ILM object storage is not configured");
  }

  return new S3Client({
    region: env.region,
    endpoint: env.endpoint,
    credentials: {
      accessKeyId: env.accessKeyId,
      secretAccessKey: env.secretAccessKey,
    },
    forcePathStyle: true,
  });
}

export async function presignPutObject(key: string, contentType: string) {
  const env = getIlmStorageEnv();
  if (!env.configured || !env.bucket) {
    throw new Error("ILM object storage is not configured");
  }

  const client = getClient();
  const command = new PutObjectCommand({
    Bucket: env.bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
  return {
    uploadUrl,
    key,
    publicUrl: publicUrlForStorageKey(key),
  };
}

export async function deleteStorageObject(key: string) {
  const env = getIlmStorageEnv();
  if (!env.configured || !env.bucket) return;

  const client = getClient();
  await client.send(
    new DeleteObjectCommand({
      Bucket: env.bucket,
      Key: key,
    }),
  );
}
