import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  Prisma,
  VisaValidationDecision,
  VisaWorkflowStatus,
} from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationMeta } from 'src/core/dtos/paginationmeta';
import { User } from '../user/generated/user';
import {
  CreateVisaRequestDto,
  IssueVisaRequestDto,
  NotifyVisaRequestDto,
  VisaKpiFiltersDto,
  VisaRequestSearchDto,
  ValidateVisaRequestDto,
  WithdrawVisaRequestDto,
} from './dto/create-visa-request.dto';
import { UpdateVisaRequestDto } from './dto/update-visa-request.dto';

export type VisaKpiSummaryResponse = {
  total: number;
  submitted: number;
  autoVerified: number;
  validated: number;
  rejected: number;
  notified: number;
  issued: number;
  withdrawn: number;
  rejectionRate: number;
  deliveryRate: number;
  avgProcessingHours: number;
};

@Injectable()
export class VisaService {
  constructor(private readonly prisma: PrismaService) {}

  private canAccess(user: User) {
    const permissions = user?.accessGroup?.permissions || [];
    return (
      permissions.includes('ACCESS_CONFERENCE_MODULE') ||
      permissions.includes('ACCESS_HONOR_LOUNGE_MODULE') ||
      user?.role === 'admin' ||
      user?.role === 'super_admin'
    );
  }

  private canManage(user: User) {
    const permissions = user?.accessGroup?.permissions || [];
    return (
      permissions.includes('MANAGE_CONFERENCES') ||
      user?.role === 'admin' ||
      user?.role === 'super_admin'
    );
  }

  private parseDate(value: string | Date, fieldLabel: string) {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(`Date invalide pour ${fieldLabel}.`);
    }
    return parsed;
  }

  private async createHistory(
    visaRequestId: string,
    status: VisaWorkflowStatus,
    changedBy: string,
    notes?: string,
    metadata?: Prisma.InputJsonValue,
  ) {
    await this.prisma.visaStatusHistory.create({
      data: {
        visaRequestId,
        status,
        changedBy,
        notes,
        metadata,
      },
    });
  }

  private async ensureVisaExists(id: string) {
    const visa = await this.prisma.visaRequest.findUnique({
      where: { id },
    });
    if (!visa) {
      throw new NotFoundException('Demande de visa introuvable.');
    }
    return visa;
  }

  private async generateDossierNumber() {
    const year = new Date().getFullYear();
    const prefix = `VISA-${year}-`;
    const latest = await this.prisma.visaRequest.findFirst({
      where: { dossierNumber: { startsWith: prefix } },
      orderBy: { createdAt: 'desc' },
      select: { dossierNumber: true },
    });

    const latestSequence = latest?.dossierNumber
      ? Number(latest.dossierNumber.replace(prefix, '')) || 0
      : 0;

    return `${prefix}${String(latestSequence + 1).padStart(5, '0')}`;
  }

  private async generateVisaNumber() {
    const year = new Date().getFullYear();
    const prefix = `SN-VISA-${year}-`;
    const latest = await this.prisma.visaRequest.findFirst({
      where: {
        visaNumber: {
          startsWith: prefix,
        },
      },
      orderBy: { updatedAt: 'desc' },
      select: { visaNumber: true },
    });

    const latestSequence = latest?.visaNumber
      ? Number(latest.visaNumber.replace(prefix, '')) || 0
      : 0;

    return `${prefix}${String(latestSequence + 1).padStart(6, '0')}`;
  }

  async create(user: User, dto: CreateVisaRequestDto) {
    if (!this.canAccess(user)) {
      throw new BadRequestException(
        "Vous n'avez pas les permissions pour créer une demande de visa.",
      );
    }

    try {
      const dossierNumber = await this.generateDossierNumber();
      const dateOfBirth = this.parseDate(dto.dateOfBirth, 'date de naissance');

      const created = await this.prisma.visaRequest.create({
        data: {
          dossierNumber,
          firstName: dto.firstName.trim(),
          lastName: dto.lastName.trim(),
          dateOfBirth,
          nationality: dto.nationality.trim(),
          passportNumber: dto.passportNumber.trim(),
          visaType: dto.visaType.trim(),
          documents: dto.documents.trim(),
          currentStatus: VisaWorkflowStatus.SUBMITTED,
          createdBy: user.id,
        },
      });

      await this.createHistory(
        created.id,
        VisaWorkflowStatus.SUBMITTED,
        user.id,
        'Soumission de la demande',
      );

      return created;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new UnprocessableEntityException(
        'Erreur lors de la création de la demande de visa.',
      );
    }
  }

  async findAll(user: User, params: VisaRequestSearchDto) {
    if (!this.canAccess(user)) {
      throw new BadRequestException(
        "Vous n'avez pas les permissions pour consulter les demandes de visa.",
      );
    }

    const where: Prisma.VisaRequestWhereInput = {};

    if (params.search) {
      where.OR = [
        { dossierNumber: { contains: params.search, mode: 'insensitive' } },
        { visaNumber: { contains: params.search, mode: 'insensitive' } },
        { passportNumber: { contains: params.search, mode: 'insensitive' } },
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
        { nationality: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.status) {
      where.currentStatus = params.status;
    }
    if (params.decision) {
      where.validationDecision = params.decision;
    }
    if (params.dossierNumber) {
      where.dossierNumber = {
        contains: params.dossierNumber,
        mode: 'insensitive',
      };
    }
    if (params.visaNumber) {
      where.visaNumber = {
        contains: params.visaNumber,
        mode: 'insensitive',
      };
    }

    if (params.decision) {
      where.validationDecision = params.decision;
    }

    if (params.dossierNumber) {
      where.dossierNumber = {
        contains: params.dossierNumber,
        mode: 'insensitive',
      };
    }

    if (params.visaNumber) {
      where.visaNumber = {
        contains: params.visaNumber,
        mode: 'insensitive',
      };
    }

    const paginationArgs: Prisma.VisaRequestFindManyArgs = {};
    if (params.page !== undefined && params.limit !== undefined) {
      paginationArgs.skip = (params.page - 1) * params.limit;
      paginationArgs.take = params.limit;
    }

    const [rows, total] = await Promise.all([
      this.prisma.visaRequest.findMany({
        where,
        include: {
          histories: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        ...paginationArgs,
      }),
      this.prisma.visaRequest.count({ where }),
    ]);

    return {
      ...new PaginationMeta(params.page || 1, params.limit || rows.length, total),
      data: rows,
    };
  }

  async findOne(id: string, user: User) {
    if (!this.canAccess(user)) {
      throw new BadRequestException(
        "Vous n'avez pas les permissions pour consulter cette demande.",
      );
    }

    const visa = await this.prisma.visaRequest.findUnique({
      where: { id },
      include: {
        histories: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!visa) {
      throw new NotFoundException('Demande de visa introuvable.');
    }

    return visa;
  }

  async update(id: string, dto: UpdateVisaRequestDto, user: User) {
    if (!this.canManage(user)) {
      throw new BadRequestException(
        "Vous n'avez pas les permissions pour modifier cette demande.",
      );
    }

    const existing = await this.ensureVisaExists(id);

    const updates: Prisma.VisaRequestUpdateInput = {};

    if (dto.firstName !== undefined) updates.firstName = dto.firstName.trim();
    if (dto.lastName !== undefined) updates.lastName = dto.lastName.trim();
    if (dto.dateOfBirth !== undefined) {
      updates.dateOfBirth = this.parseDate(dto.dateOfBirth, 'date de naissance');
    }
    if (dto.nationality !== undefined) updates.nationality = dto.nationality.trim();
    if (dto.passportNumber !== undefined) {
      updates.passportNumber = dto.passportNumber.trim();
    }
    if (dto.visaType !== undefined) updates.visaType = dto.visaType.trim();
    if (dto.documents !== undefined) updates.documents = dto.documents.trim();
    if (dto.automaticScore !== undefined) updates.automaticScore = dto.automaticScore;
    if (dto.dpiAnalysis !== undefined) updates.dpiAnalysis = dto.dpiAnalysis.trim();
    if (dto.rejectionReason !== undefined) {
      updates.rejectionReason = dto.rejectionReason?.trim() || null;
    }

    const updated = await this.prisma.visaRequest.update({
      where: { id: existing.id },
      data: updates,
    });

    await this.createHistory(
      updated.id,
      updated.currentStatus,
      user.id,
      'Mise à jour de la demande',
    );

    return updated;
  }

  async autoVerify(id: string, user: User) {
    if (!this.canManage(user)) {
      throw new BadRequestException(
        "Vous n'avez pas les permissions pour lancer la vérification automatique.",
      );
    }

    const existing = await this.ensureVisaExists(id);
    if (existing.currentStatus === VisaWorkflowStatus.WITHDRAWN) {
      throw new BadRequestException(
        'La demande est déjà retirée et ne peut plus être vérifiée.',
      );
    }

    const scoreBase = Math.floor(
      ((existing.passportNumber.length +
        existing.nationality.length +
        existing.visaType.length) %
        50) + 50,
    );
    const automaticScore = Number(scoreBase.toFixed(2));

    const updated = await this.prisma.visaRequest.update({
      where: { id },
      data: {
        automaticScore,
        currentStatus: VisaWorkflowStatus.AUTO_VERIFIED,
      },
    });

    await this.createHistory(
      id,
      VisaWorkflowStatus.AUTO_VERIFIED,
      user.id,
      'Vérification automatique exécutée',
      {
        automaticScore,
      } as Prisma.InputJsonValue,
    );

    return updated;
  }

  async validate(id: string, dto: ValidateVisaRequestDto, user: User) {
    if (!this.canManage(user)) {
      throw new BadRequestException(
        "Vous n'avez pas les permissions pour valider cette demande.",
      );
    }

    const existing = await this.ensureVisaExists(id);

    if (
      existing.currentStatus === VisaWorkflowStatus.ISSUED ||
      existing.currentStatus === VisaWorkflowStatus.WITHDRAWN
    ) {
      throw new BadRequestException(
        "Cette demande ne peut plus être validée à ce stade du workflow.",
      );
    }

    if (dto.decision === VisaValidationDecision.REJECT && !dto.rejectionReason?.trim()) {
      throw new BadRequestException(
        'Le motif de rejet est obligatoire lorsque la décision est Rejeter.',
      );
    }

    const nextStatus =
      dto.decision === VisaValidationDecision.APPROVE
        ? VisaWorkflowStatus.VALIDATED
        : VisaWorkflowStatus.REJECTED;

    const updated = await this.prisma.visaRequest.update({
      where: { id },
      data: {
        automaticScore: dto.automaticScore,
        dpiAnalysis: dto.dpiAnalysis.trim(),
        validationDecision: dto.decision,
        rejectionReason:
          dto.decision === VisaValidationDecision.REJECT
            ? dto.rejectionReason?.trim() || null
            : null,
        currentStatus: nextStatus,
        validatedBy: user.id,
      },
    });

    await this.createHistory(
      id,
      nextStatus,
      user.id,
      dto.decision === VisaValidationDecision.APPROVE
        ? 'Validation DPCT approuvée'
        : 'Validation DPCT rejetée',
      {
        decision: dto.decision,
        automaticScore: dto.automaticScore,
      } as Prisma.InputJsonValue,
    );

    return updated;
  }

  async notify(id: string, dto: NotifyVisaRequestDto, user: User) {
    if (!this.canManage(user)) {
      throw new BadRequestException(
        "Vous n'avez pas les permissions pour notifier cette demande.",
      );
    }

    const existing = await this.ensureVisaExists(id);
    if (
      existing.currentStatus !== VisaWorkflowStatus.VALIDATED &&
      existing.currentStatus !== VisaWorkflowStatus.REJECTED
    ) {
      throw new BadRequestException(
        "La notification est possible uniquement après validation ou rejet.",
      );
    }

    if (dto.dossierNumber !== existing.dossierNumber) {
      throw new BadRequestException(
        'Le numéro de dossier fourni ne correspond pas à la demande visée.',
      );
    }

    const updated = await this.prisma.visaRequest.update({
      where: { id },
      data: {
        currentStatus: VisaWorkflowStatus.NOTIFIED,
        notificationSentAt: new Date(),
      },
    });

    await this.createHistory(
      id,
      VisaWorkflowStatus.NOTIFIED,
      user.id,
      dto.notes?.trim() || 'Notification envoyée au demandeur',
      {
        dossierNumber: dto.dossierNumber,
      } as Prisma.InputJsonValue,
    );

    return updated;
  }

  async issue(id: string, dto: IssueVisaRequestDto, user: User) {
    if (!this.canManage(user)) {
      throw new BadRequestException(
        "Vous n'avez pas les permissions pour émettre un visa.",
      );
    }

    const existing = await this.ensureVisaExists(id);
    if (existing.currentStatus === VisaWorkflowStatus.REJECTED) {
      throw new BadRequestException("Impossible d'émettre un visa rejeté.");
    }
    if (existing.currentStatus === VisaWorkflowStatus.WITHDRAWN) {
      throw new BadRequestException("Le visa est déjà retiré.");
    }

    const visaNumber = dto.visaNumber?.trim() || (await this.generateVisaNumber());
    if (dto.dossierNumber !== existing.dossierNumber) {
      throw new BadRequestException(
        'Le numéro de dossier fourni ne correspond pas à la demande visée.',
      );
    }

    const issueDate = dto.issuedAt
      ? this.parseDate(dto.issuedAt, "date d'emission")
      : new Date();

    const updated = await this.prisma.visaRequest.update({
      where: { id },
      data: {
        currentStatus: VisaWorkflowStatus.ISSUED,
        visaNumber,
        issuedAt: issueDate,
        emittedBy: user.id,
      },
    });

    await this.createHistory(
      id,
      VisaWorkflowStatus.ISSUED,
      user.id,
      dto.notes?.trim() || 'Visa emis et pret au retrait',
      {
        dossierNumber: dto.dossierNumber,
        visaNumber,
        issuedAt: issueDate.toISOString(),
      } as Prisma.InputJsonValue,
    );

    return updated;
  }

  async withdraw(id: string, dto: WithdrawVisaRequestDto, user: User) {
    if (!this.canManage(user)) {
      throw new BadRequestException(
        "Vous n'avez pas les permissions pour enregistrer un retrait.",
      );
    }

    const existing = await this.ensureVisaExists(id);
    if (existing.currentStatus !== VisaWorkflowStatus.ISSUED) {
      throw new BadRequestException(
        "Le retrait est possible uniquement après l'émission du visa.",
      );
    }

    if (!existing.visaNumber) {
      throw new BadRequestException(
        "Aucun numero de visa n'est associe a cette demande.",
      );
    }

    if (dto.visaNumber !== existing.visaNumber) {
      throw new BadRequestException(
        'Le numero de visa fourni ne correspond pas a la demande visee.',
      );
    }

    const withdrawalDate = dto.withdrawalDate
      ? this.parseDate(dto.withdrawalDate, 'date de retrait')
      : new Date();

    const updated = await this.prisma.visaRequest.update({
      where: { id },
      data: {
        currentStatus: VisaWorkflowStatus.WITHDRAWN,
        collectorName: dto.collectorName.trim(),
        collectorIdentityDocument: dto.collectorIdentityDocument.trim(),
        collectorSignature: dto.collectorSignature.trim(),
        withdrawalDate,
        withdrawnAt: withdrawalDate,
        withdrawnBy: user.id,
      },
    });

    await this.createHistory(
      id,
      VisaWorkflowStatus.WITHDRAWN,
      user.id,
      'Visa retiré',
      {
        visaNumber: dto.visaNumber,
        collectorName: dto.collectorName,
        collectorIdentityDocument: dto.collectorIdentityDocument,
      } as Prisma.InputJsonValue,
    );

    return updated;
  }

  async getHistory(id: string, user: User) {
    if (!this.canAccess(user)) {
      throw new BadRequestException(
        "Vous n'avez pas les permissions pour consulter l'historique.",
      );
    }

    await this.ensureVisaExists(id);
    return this.prisma.visaStatusHistory.findMany({
      where: { visaRequestId: id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getKpis(user: User, params: VisaKpiFiltersDto) {
    if (!this.canAccess(user)) {
      throw new BadRequestException(
        "Vous n'avez pas les permissions pour consulter les indicateurs Visa.",
      );
    }

    const where: Prisma.VisaRequestWhereInput = {};
    if (params.from || params.to) {
      where.createdAt = {};
      if (params.from) {
        where.createdAt.gte = this.parseDate(params.from, 'date début');
      }
      if (params.to) {
        where.createdAt.lte = this.parseDate(params.to, 'date fin');
      }
    }

    const [
      total,
      submitted,
      autoVerified,
      validated,
      rejected,
      notified,
      issued,
      withdrawn,
    ] = await Promise.all([
      this.prisma.visaRequest.count({ where }),
      this.prisma.visaRequest.count({
        where: { ...where, currentStatus: VisaWorkflowStatus.SUBMITTED },
      }),
      this.prisma.visaRequest.count({
        where: { ...where, currentStatus: VisaWorkflowStatus.AUTO_VERIFIED },
      }),
      this.prisma.visaRequest.count({
        where: { ...where, currentStatus: VisaWorkflowStatus.VALIDATED },
      }),
      this.prisma.visaRequest.count({
        where: { ...where, currentStatus: VisaWorkflowStatus.REJECTED },
      }),
      this.prisma.visaRequest.count({
        where: { ...where, currentStatus: VisaWorkflowStatus.NOTIFIED },
      }),
      this.prisma.visaRequest.count({
        where: { ...where, currentStatus: VisaWorkflowStatus.ISSUED },
      }),
      this.prisma.visaRequest.count({
        where: { ...where, currentStatus: VisaWorkflowStatus.WITHDRAWN },
      }),
    ]);

    let avgProcessingHours = 0;
    const issuedRows = await this.prisma.visaRequest.findMany({
      where: {
        ...where,
        issuedAt: { not: null },
      },
      select: {
        createdAt: true,
        issuedAt: true,
      },
      take: 5000,
    });

    if (issuedRows.length > 0) {
      const totalMs = issuedRows.reduce((acc, row) => {
        if (!row.issuedAt) return acc;
        return acc + (row.issuedAt.getTime() - row.createdAt.getTime());
      }, 0);
      avgProcessingHours = Number(
        (totalMs / issuedRows.length / (1000 * 60 * 60)).toFixed(2),
      );
    }

    const rejectionRate = total > 0 ? Number(((rejected / total) * 100).toFixed(2)) : 0;
    const deliveryRate = total > 0 ? Number(((issued / total) * 100).toFixed(2)) : 0;

    return {
      total,
      submitted,
      autoVerified,
      validated,
      rejected,
      notified,
      issued,
      withdrawn,
      rejectionRate,
      deliveryRate,
      avgProcessingHours,
    };
  }
}
