import { Controller, Get, Param, Query } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { Observable } from 'rxjs';
import { Organisme, OrganismeList } from './generated/organisme';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('institutions')
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  // 🔹 Récupérer tous les organismes
  @Get()
  getAllOrganismes(): Observable<OrganismeList> {
    return this.institutionService.getAllOrganismes();
  }

  // 🔹 Récupérer un organisme par ID
  @Get(':id')
  getOrganismeById(@Param('id') id: string): Observable<Organisme> {
    return this.institutionService.getOrganismeById(id);
  }

  // 🔹 Récupérer plusieurs organismes par IDs
  @Get('multiple')
  getOrganismesByIds(@Query('ids') ids: string): Observable<OrganismeList> {
    const idArray = ids.split(',');
    return this.institutionService.getOrganismesByIds(idArray);
  }
}
