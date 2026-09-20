import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getR2Client, r2PublicUrl } from '@/lib/r2';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const MAX_SIZE = 8 * 1024 * 1024; // 8MB per image is plenty for product photos
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/** Admin-only. Accepts one or more files under the form field "files" and
 *  uploads each straight to Cloudflare R2, returning their public URLs. */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: 'Send the images as multipart form data.' }, { status: 400 });
  }

  const files = form.getAll('files').filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return Response.json({ error: 'No files were received.' }, { status: 400 });
  }

  let client;
  try {
    client = getR2Client();
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }

  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) {
    return Response.json({ error: 'R2_BUCKET_NAME is not set in .env.' }, { status: 500 });
  }

  const urls: string[] = [];
  for (const file of files) {
    if (!ALLOWED.includes(file.type)) {
      return Response.json({ error: `${file.name}: only JPG, PNG, WebP or GIF images are accepted.` }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return Response.json({ error: `${file.name} is larger than 8MB.` }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'image';
    const key = `products/${Date.now()}-${base}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    try {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        })
      );
    } catch (err) {
      console.error('[r2 upload]', err);
      return Response.json({ error: 'Upload to storage failed. Check your R2 credentials.' }, { status: 500 });
    }

    urls.push(r2PublicUrl(key));
  }

  return Response.json({ urls }, { status: 201 });
}
