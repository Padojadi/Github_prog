import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccommodationService } from './accommodation.service';
import {
  AttachAccommodationConferenceDto,
  CreateAccommodationDto,
} from './dto/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/roles.decorator';
import { UserPermission } from 'src/constants/enum';

@ApiTags('accommodation')
@Controller('accommodation')
export class AccommodationController {
  constructor(private readonly accommodationService: AccommodationService) {}

  @Roles(UserPermission.MANAGE_CONFERENCES)
  @Post()
  create(@Body() createAccommodationDto: CreateAccommodationDto) {
    return this.accommodationService.create(createAccommodationDto);
  }

  @Roles(UserPermission.MANAGE_CONFERENCES)
  @Post('conference')
  attachConference(@Body() dto: AttachAccommodationConferenceDto) {
    return this.accommodationService.attachConference(dto);
  }

  @Roles(UserPermission.MANAGE_CONFERENCES)
  @Patch(':accommodationId/conference/:conferenceId')
  detachAccommodation(@Param() params) {
    return this.accommodationService.detachConference(params);
  }

  @Get()
  findAll() {
    return this.accommodationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accommodationService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserPermission.MANAGE_CONFERENCES)
  update(
    @Param('id') id: string,
    @Body() updateAccommodationDto: UpdateAccommodationDto,
  ) {
    return this.accommodationService.update(id, updateAccommodationDto);
  }

  @Delete(':id')
  @Roles(UserPermission.MANAGE_CONFERENCES)
  remove(@Param('id') id: string) {
    return this.accommodationService.remove(id);
  }
}
