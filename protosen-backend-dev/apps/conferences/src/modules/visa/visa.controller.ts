import {
  Body,
  Controller,
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
import { VisaService } from './visa.service';
import {
  CreateVisaRequestDto,
  IssueVisaRequestDto,
  NotifyVisaRequestDto,
  ValidateVisaRequestDto,
  VisaKpiFiltersDto,
  VisaRequestSearchDto,
  WithdrawVisaRequestDto,
} from './dto/create-visa-request.dto';
import { UpdateVisaRequestDto } from './dto/update-visa-request.dto';

@ApiTags('visa')
@Controller('visa')
export class VisaController {
  constructor(private readonly visaService: VisaService) {}

  @Get()
  @Roles(UserPermission.ACCESS_CONFERENCE_MODULE)
  findAll(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, skipMissingProperties: true }))
    dto: VisaRequestSearchDto,
  ) {
    return this.visaService.findAll(req.user, dto);
  }

  @Get('kpis/summary')
  @Roles(UserPermission.ACCESS_CONFERENCE_MODULE)
  getKpis(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, skipMissingProperties: true }))
    dto: VisaKpiFiltersDto,
  ) {
    return this.visaService.getKpis(req.user, dto);
  }

  @Get(':id/history')
  @Roles(UserPermission.ACCESS_CONFERENCE_MODULE)
  getHistory(@Param('id') id: string, @Req() req) {
    return this.visaService.getHistory(id, req.user);
  }

  @Get(':id')
  @Roles(UserPermission.ACCESS_CONFERENCE_MODULE)
  findOne(@Param('id') id: string, @Req() req) {
    return this.visaService.findOne(id, req.user);
  }

  @Post()
  @Roles(UserPermission.ACCESS_CONFERENCE_MODULE)
  create(@Req() req, @Body() dto: CreateVisaRequestDto) {
    return this.visaService.create(req.user, dto);
  }

  @Patch(':id/auto-verify')
  @Roles(UserPermission.ACCESS_CONFERENCE_MODULE)
  autoVerify(@Param('id') id: string, @Req() req) {
    return this.visaService.autoVerify(id, req.user);
  }

  @Patch(':id/validate')
  @Roles(UserPermission.MANAGE_CONFERENCES, UserPermission.ACCESS_CONFERENCE_MODULE)
  validate(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: ValidateVisaRequestDto,
  ) {
    return this.visaService.validate(id, dto, req.user);
  }

  @Patch(':id/notify')
  @Roles(UserPermission.MANAGE_CONFERENCES, UserPermission.ACCESS_CONFERENCE_MODULE)
  notify(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: NotifyVisaRequestDto,
  ) {
    return this.visaService.notify(id, dto, req.user);
  }

  @Patch(':id/emit')
  @Roles(UserPermission.MANAGE_CONFERENCES, UserPermission.ACCESS_CONFERENCE_MODULE)
  issue(@Param('id') id: string, @Req() req, @Body() dto: IssueVisaRequestDto) {
    return this.visaService.issue(id, dto, req.user);
  }

  @Patch(':id/withdraw')
  @Roles(UserPermission.ACCESS_CONFERENCE_MODULE)
  withdraw(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: WithdrawVisaRequestDto,
  ) {
    return this.visaService.withdraw(id, dto, req.user);
  }

  @Patch(':id')
  @Roles(UserPermission.MANAGE_CONFERENCES, UserPermission.ACCESS_CONFERENCE_MODULE)
  update(@Param('id') id: string, @Req() req, @Body() dto: UpdateVisaRequestDto) {
    return this.visaService.update(id, dto, req.user);
  }
}
