import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserPermission } from 'src/constants/enum';
import { Roles } from 'src/core/decorators/roles.decorator';
import {
  CreateVipAccessRequestDto,
  CreateVipBookingDto,
  CreateVipLoungeDto,
  UpdateVipAccessRequestStatusDto,
  UpdateVipBookingStatusDto,
  UpdateVipLoungeDto,
} from './dto/vip-lounge.dto';
import { VipLoungeService } from './vip-lounge.service';

@ApiTags('vip-lounge')
@Controller('vip-lounge')
export class VipLoungeController {
  constructor(private readonly vipLoungeService: VipLoungeService) {}

  @Get('lounges')
  @Roles(UserPermission.ACCESS_VIP_LOUNGE_MODULE)
  getLounges() {
    return this.vipLoungeService.getLounges();
  }

  @Get('lounges/:id')
  @Roles(UserPermission.ACCESS_VIP_LOUNGE_MODULE)
  getLoungeById(@Param('id') id: string) {
    return this.vipLoungeService.getLoungeById(id);
  }

  @Post('lounges')
  @Roles(UserPermission.MANAGE_VIP_LOUNGE)
  createLounge(@Body() dto: CreateVipLoungeDto, @Req() req) {
    return this.vipLoungeService.createLounge(dto, req.user);
  }

  @Patch('lounges/:id')
  @Roles(UserPermission.MANAGE_VIP_LOUNGE)
  updateLounge(@Param('id') id: string, @Body() dto: UpdateVipLoungeDto, @Req() req) {
    return this.vipLoungeService.updateLounge(id, dto, req.user);
  }

  @Delete('lounges/:id')
  @Roles(UserPermission.MANAGE_VIP_LOUNGE)
  deleteLounge(@Param('id') id: string, @Req() req) {
    return this.vipLoungeService.deleteLounge(id, req.user);
  }

  @Post('bookings')
  @Roles(UserPermission.ACCESS_VIP_LOUNGE_MODULE)
  createBooking(@Body() dto: CreateVipBookingDto, @Req() req) {
    return this.vipLoungeService.createBooking(dto, req.user);
  }

  @Get('bookings/my')
  @Roles(UserPermission.ACCESS_VIP_LOUNGE_MODULE)
  getMyBookings(@Req() req) {
    return this.vipLoungeService.getMyBookings(req.user);
  }

  @Get('bookings')
  @Roles(UserPermission.MANAGE_VIP_LOUNGE)
  getAllBookings(@Req() req) {
    return this.vipLoungeService.getAllBookings(req.user);
  }

  @Patch('bookings/:id/status')
  @Roles(UserPermission.MANAGE_VIP_LOUNGE)
  updateBookingStatus(
    @Param('id') id: string,
    @Body() dto: UpdateVipBookingStatusDto,
    @Req() req,
  ) {
    return this.vipLoungeService.updateBookingStatus(id, dto, req.user);
  }

  @Get('bookings/history')
  @Roles(UserPermission.MANAGE_VIP_LOUNGE)
  getBookingHistory(@Req() req) {
    return this.vipLoungeService.getBookingHistory(req.user);
  }

  @Post('access-requests')
  @Roles(UserPermission.ACCESS_VIP_LOUNGE_MODULE)
  createAccessRequest(@Body() dto: CreateVipAccessRequestDto, @Req() req) {
    return this.vipLoungeService.createAccessRequest(dto, req.user);
  }

  @Get('access-requests/my')
  @Roles(UserPermission.ACCESS_VIP_LOUNGE_MODULE)
  getMyAccessRequests(@Req() req) {
    return this.vipLoungeService.getMyAccessRequests(req.user);
  }

  @Get('access-requests')
  @Roles(UserPermission.MANAGE_VIP_LOUNGE)
  getAllAccessRequests(@Req() req) {
    return this.vipLoungeService.getAllAccessRequests(req.user);
  }

  @Patch('access-requests/:id/status')
  @Roles(UserPermission.MANAGE_VIP_LOUNGE)
  updateAccessRequestStatus(
    @Param('id') id: string,
    @Body() dto: UpdateVipAccessRequestStatusDto,
    @Req() req,
  ) {
    return this.vipLoungeService.updateAccessRequestStatus(id, dto, req.user);
  }
}
