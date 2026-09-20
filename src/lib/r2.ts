import { S3Client } from '@aws-sdk/client-s3';

/**
 * Cloudflare R2 is S3-compatible, so the standard AWS SDK talks to it
 * directly — just point the endpoint at your account's R2 URL and use
 * region 'auto'. No AWS account involved.
 */
export function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Cloudflare R2 is not configured. Fill in R2_ACCOUNT_ID, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY in .env.'
    );
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export function r2PublicUrl(key: string) {
  const base = process.env.R2_PUBLIC_URL;
  if (!base) throw new Error('R2_PUBLIC_URL is not set in .env.');
  return `${base.replace(/\/$/, '')}/${key}`;
}
