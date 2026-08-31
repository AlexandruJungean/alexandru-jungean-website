import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const ALLOWED_EXTENSIONS = new Set([
  'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx',
  'png', 'jpg', 'jpeg', 'webp', 'svg', 'fig', 'zip'
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file

function fileExtension(filename) {
  const i = String(filename || '').lastIndexOf('.');
  return i === -1 ? '' : String(filename).slice(i + 1).toLowerCase();
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { filename, contentType, size, clientName } = JSON.parse(event.body);

    var corsHeaders = { 'Access-Control-Allow-Origin': '*' };

    if (!filename) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing filename' }) };
    }

    const ext = fileExtension(filename);
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'File type not allowed. Use PDF, DOC, XLS, PPT, PNG, JPG, SVG, FIG, or ZIP.' }) };
    }

    if (size && size > MAX_FILE_SIZE) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'File too large. Maximum 10MB per file.' }) };
    }

    const resolvedType = contentType || 'application/octet-stream';

    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
      }
    });

    const safeName = (clientName || 'unknown').replace(/[^a-zA-Z0-9-_ ]/g, '').trim().replace(/\s+/g, '-').substring(0, 50);
    const safeFilename = Date.now() + '_' + filename.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 80);
    const key = 'intake-uploads/' + safeName + '/' + safeFilename;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: resolvedType
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 600 });
    const publicBase = process.env.R2_PUBLIC_URL || `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.dev`;
    const fileUrl = publicBase + '/' + key;

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ uploadUrl, fileUrl, key })
    };
  } catch (error) {
    console.error('Presign error:', error);
    return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'Failed to generate upload URL.' }) };
  }
}
