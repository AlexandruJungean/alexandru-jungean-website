import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const ALLOWED_TYPES = [
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml',
  'application/zip', 'application/x-zip-compressed',
  'application/octet-stream'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file

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

    if (!filename || !contentType) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing filename or contentType' }) };
    }

    if (size && size > MAX_FILE_SIZE) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'File too large. Maximum 10MB per file.' }) };
    }

    if (!ALLOWED_TYPES.includes(contentType) && contentType !== 'application/octet-stream') {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'File type not allowed.' }) };
    }

    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
      }
    });

    const ext = filename.includes('.') ? filename.split('.').pop() : '';
    const safeName = (clientName || 'unknown').replace(/[^a-zA-Z0-9-_ ]/g, '').trim().replace(/\s+/g, '-').substring(0, 50);
    const safeFilename = Date.now() + '_' + filename.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 80);
    const key = 'intake-uploads/' + safeName + '/' + safeFilename;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType
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
