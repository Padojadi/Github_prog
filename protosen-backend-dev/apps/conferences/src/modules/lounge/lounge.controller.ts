import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserPermission } from 'src/constants/enum';
import { Roles } from 'src/core/decorators/roles.decorator';
import { LoungeService } from './lounge.service';
import {
  CreateLoungeBookingDto,
  CreateLoungeDto,
  LoungeBookingSearchDto,
  LoungeSearchDto,
  UpdateLoungeBookingStatusDto,
} from './dto/create-lounge.dto';
import { UpdateLoungeDto } from './dto/update-lounge.dto';

@ApiTags('lounge')
@Controller('lounge')
export class LoungeController {
  constructor(private readonly loungeService: LoungeService) {}

  @Get('bookings')
  @Roles(
    UserPermission.ACCESS_HONOR_LOUNGE_MODULE,
    UserPermission.ACCESS_CONFERENCE_MODULE,
  )
  getBookings(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, skipMissingProperties: true }))
    dto: LoungeBookingSearchDto,
  ) {
    return this.loungeService.findBookings(req.user, dto);
  }

  @Post('bookings')
  @Roles(
    UserPermission.ACCESS_HONOR_LOUNGE_MODULE,
    UserPermission.ACCESS_CONFERENCE_MODULE,
  )
  createBooking(@Req() req, @Body() dto: CreateLoungeBookingDto) {
    return this.loungeService.createBooking(req.user, dto);
  }

  @Patch('bookings/:id/status')
  @Roles(
    UserPermission.MANAGE_CONFERENCES,
    UserPermission.ACCESS_HONOR_LOUNGE_MODULE,
    UserPermission.ACCESS_CONFERENCE_MODULE,
  )
  updateBookingStatus(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: UpdateLoungeBookingStatusDto,
  ) {
    return this.loungeService.updateBookingStatus(id, req.user, dto);
  }

  @Get()
  @Roles(
    UserPermission.ACCESS_HONOR_LOUNGE_MODULE,
    UserPermission.ACCESS_CONFERENCE_MODULE,
  )
  findAllLounges(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, skipMissingProperties: true }))
    dto: LoungeSearchDto,
  ) {
    return this.loungeService.findAll(dto, req.user);
  }

  @Get('bookings/:id')
  @Roles(
    UserPermission.ACCESS_HONOR_LOUNGE_MODULE,
    UserPermission.ACCESS_CONFERENCE_MODULE,
  )
  findOneBooking(@Param('id') id: string, @Req() req) {
    return this.loungeService.getBookingById(id, req.user);
  }

  @Get('bookings/:id/history')
  @Roles(
    UserPermission.ACCESS_HONOR_LOUNGE_MODULE,
    UserPermission.ACCESS_CONFERENCE_MODULE,
  )
  findBookingHistory(@Param('id') id: string, @Req() req) {
    return this.loungeService.getBookingHistory(id, req.user);
  }

  @Get(':id')
  @Roles(
    UserPermission.ACCESS_HONOR_LOUNGE_MODULE,
    UserPermission.ACCESS_CONFERENCE_MODULE,
  )
  findOneLounge(@Param('id') id: string, @Req() req) {
    return this.loungeService.findOne(id, req.user);
  }

  @Post()
  @Roles(
    UserPermission.MANAGE_CONFERENCES,
    UserPermission.ACCESS_HONOR_LOUNGE_MODULE,
    UserPermission.ACCESS_CONFERENCE_MODULE,
  )
  createLounge(@Req() req, @Body() dto: CreateLoungeDto) {
    return this.loungeService.create(req.user, dto);
  }

  @Patch(':id')
  @Roles(
    UserPermission.MANAGE_CONFERENCES,
    UserPermission.ACCESS_HONOR_LOUNGE_MODULE,
    UserPermission.ACCESS_CONFERENCE_MODULE,
  )
  updateLounge(@Param('id') id: string, @Req() req, @Body() dto: UpdateLoungeDto) {
    return this.loungeService.updateLounge(id, dto, req.user);
  }

  @Delete(':id')
  @Roles(
    UserPermission.MANAGE_CONFERENCES,
    UserPermission.ACCESS_HONOR_LOUNGE_MODULE,
    UserPermission.ACCESS_CONFERENCE_MODULE,
  )
  removeLounge(@Param('id') id: string, @Req() req) {
    return this.loungeService.removeLounge(id, req.user);
  }
}
