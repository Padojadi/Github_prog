import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
	GetObjectCommand,
} from '@aws-sdk/client-s3';
import { CustomFile } from '../types';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import log from '@shared/utils/logger';
import env from '@appconfig/env.config';

const accessKey = env.ACCESS_KEY;
const secretAccessKey = env.SECRET_KEY;
const bucket = env.BUCKET_NAME;
const region = env.BUCKET_REGION;

const client = new S3Client({
	credentials: {
		accessKeyId: accessKey,
		secretAccessKey: secretAccessKey,
	},
	region: region,
});

const getPresignedUrl = async ({ key }: Record<string, string>) => {
	const command = new GetObjectCommand({ Bucket: bucket, Key: key });
	return await getSignedUrl(client, command, { expiresIn: 3600 });
};

interface IFileService {
	uploadFile(slug: string, file: CustomFile): Promise<string>;
	deleteFile(key: string): Promise<string>;
	getFileUrl(key: string): Promise<string>;
}

export class FileService implements IFileService {
	async uploadFile(key: string, file: CustomFile): Promise<string> {
		try {
			if (!key) {throw new Error('Key cannot be empty');}

			if (!file) {throw new Error('No file uploaded');}

			if (file.size > 7 * 1024 * 1024) {
				throw new Error('Size too large');
			}

			const command = new PutObjectCommand({
				Bucket: bucket,
				Key: key,
				Body: file.buffer,
				ContentType: file.mimetype,
			});
			await client.send(command);

			return key;
		} catch (error) {
			log.error({ error, key }, 'Failed to upload file');
			throw error;
		}
	}

	async generatePresignedUrl(fileType: string, fileName: string) {
		const params = {
			Bucket: bucket,
			Key: fileName,
			ContentType: fileType,
		};

		const command = new PutObjectCommand(params);

		try {
			const url = await getSignedUrl(client, command, { expiresIn: 900 }); // 900 secondes = 15 minutes
			return url;
		} catch (error) {
			log.error({ error, fileName }, 'Failed to generate presigned URL');
			throw error;
		}
	}

	async deleteFile(key: string): Promise<string> {
		try {
			const command = new DeleteObjectCommand({
				Bucket: bucket,
				Key: key,
			});

			await client.send(command);

			return 'File deleted successfully';
		} catch (error) {
			log.error({ error, key }, 'Failed to delete file');
			throw error;
		}
	}

	async getFileUrl(key: string): Promise<string> {
		try {
			const url = await getPresignedUrl({ key: key });
			return url;
		} catch (error) {
			log.error({ error, key }, 'Failed to get file URL');
			throw error;
		}
	}

	async getFilesUrl(keys: string[]): Promise<string[]> {
		const presignedUrls: string[] = [];
		for (const key of keys) {
			const presignedUrl = await this.getFileUrl(key);
			presignedUrls.push(presignedUrl);
		}
		return presignedUrls;
	}
}
