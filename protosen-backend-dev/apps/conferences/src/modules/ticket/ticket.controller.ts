import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UserPermission } from 'src/constants/enum';
import { Roles } from 'src/core/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { SkipAuth } from 'src/core/decorators/skipauth.decorator';

@ApiTags('ticket')
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @Roles(UserPermission.MANAGE_CONFERENCES)
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @SkipAuth()
  @Get('conference/:id')
  findConferences(@Param('id') conferenceId: string) {
    return this.ticketService.findAll(conferenceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserPermission.MANAGE_CONFERENCES)
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @Roles(UserPermission.MANAGE_CONFERENCES)
  remove(@Param('id') id: string) {
    return this.ticketService.remove(id);
  }
}
