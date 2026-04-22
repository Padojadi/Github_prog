import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  PutObjectCommandInput,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CreateFileUploadDto } from './dto/create-file-upload.dto';
import { api_code } from 'src/constants/api.codes';
import { Readable } from 'stream';
import * as fs from 'fs';

@Injectable()
export class FileUploadService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.BUCKET_KEY,
        secretAccessKey: process.env.BUCKET_SECRET,
      },
    });

    this.bucketName = process.env.BUCKET_NAME;
  }

  async getPresignedUrl(dto: CreateFileUploadDto): Promise<{
    url: string;
    key: string;
    bucket_url: string;
  }> {
    try {
      const [name, ext] = dto.filename.split(/\.(?=[^\.]+$)/); // coupe au dernier point
      const safeName = name.replace(/\s+/g, '-').replace(/\./g, '');
      const key = `conferences/${Date.now()}-${safeName}.${ext}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: dto.contentType || 'application/octet-stream',
        //  ContentDisposition: 'inline' | 'attachment',
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600 * 5,
      });

      return {
        url,
        key,
        bucket_url: `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com`,
      };
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_209);
    }
  }

  async deleteFile(
    key: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.s3Client.send(command);
      return { success: true, message: `File ${key} deleted successfully` };
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_210);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    directory: string,
  ): Promise<string> {
    try {
      const folder = directory
        ? directory.endsWith('/')
          ? directory
          : `${directory}/`
        : '';

      const baseUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com`;

      const [name, ext] = file.originalname.split(/\.(?=[^\.]+$)/);
      const safeName = name.replace(/\s+/g, '-').replace(/\./g, '');
      const key = `${folder}${Date.now()}-${safeName}.${ext}`;

      const params: PutObjectCommandInput = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        // ACL: 'public-read',
      };

      await this.s3Client.send(new PutObjectCommand(params));

      return `${baseUrl}/${params.Key}`;
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(api_code.MSG_300);
    }
  }
  async downloadFileFromBucket(
    fileKey: string,
    downloadPath: string,
  ): Promise<void> {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    };

    const command = new GetObjectCommand(params);

    try {
      const { Body } = (await this.s3Client.send(command)) as {
        Body: Readable;
      };
      const writeStream = fs.createWriteStream(downloadPath);

      return new Promise((resolve, reject) => {
        Body.pipe(writeStream);
        Body.on('end', resolve);
        Body.on('error', reject);
      });
    } catch (err) {
      console.error(`Failed to download file: ${err.message}`);
      throw err;
    }
  }

  async uploadBuffer(
    file: Buffer,
    directory: string,
    ext: string,
  ): Promise<string> {
    try {
      const folderPath = directory
        ? directory.endsWith('/')
          ? directory
          : `${directory}/`
        : '';

      const params: PutObjectCommandInput = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${folderPath}${Date.now()}.${ext}`,
        Body: file,
        ContentType:
          ext === 'pdf' ? 'application/pdf' : 'application/octet-stream',
      };

      await this.s3Client.send(new PutObjectCommand(params));

      return `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${params.Key}`;
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(api_code.MSG_202);
    }
  }
}
