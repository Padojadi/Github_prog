import { Controller, Post, Body } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { CreateFileUploadDto } from './dto/create-file-upload.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('file-upload')
@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('presigned-url')
  async getPresignedUrl(@Body() createFileUploadDto: CreateFileUploadDto) {
    return this.fileUploadService.getPresignedUrl(createFileUploadDto);
  }
}
