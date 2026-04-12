import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import {
  CreateLoungeBookingDto,
  CreateLoungeDto,
  LoungeBookingSearchDto,
  LoungeSearchDto,
  UpdateLoungeBookingStatusDto,
} from './dto/create-lounge.dto';
import { UpdateLoungeDto } from './dto/update-lounge.dto';
import {
  LoungeBookingStatus,
  LoungePaymentMethod,
  LoungePaymentStatus,
  LoungeStatus,
  Prisma,
} from '@prisma/client';
import { PaginationMeta } from 'src/core/dtos/paginationmeta';
import { User } from '../user/generated/user';

@Injectable()
export class LoungeService {
  constructor(private readonly prisma: PrismaService) {}

  private asInputJsonValue(value: unknown): Prisma.InputJsonValue {
    return value as Prisma.InputJsonValue;
  }

  private hasPermission(user: User, permission: string): boolean {
    return (user?.accessGroup?.permissions || []).includes(permission);
  }

  private canAccessLoungeModule(user: User): boolean {
    return (
      this.hasPermission(user, 'ACCESS_HONOR_LOUNGE_MODULE') ||
      this.hasPermission(user, 'ACCESS_CONFERENCE_MODULE')
    );
  }

  private canManageLounges(user: User): boolean {
    return (
      this.hasPermission(user, 'MANAGE_CONFERENCES') ||
      user.role === 'admin' ||
      user.role === 'super_admin'
    );
  }

  private canConfirmOrCancel(user: User): boolean {
    return this.canManageLounges(user);
  }

  async create(user: User, dto: CreateLoungeDto) {
    try {
      if (!this.canAccessLoungeModule(user) || !this.canManageLounges(user)) {
        throw new BadRequestException(
          "Vous n'avez pas les permissions pour créer un salon.",
        );
      }

      return await this.prisma.lounge.create({
        data: {
          name: dto.name,
          description: dto.description,
          capacity: dto.capacity,
          amenities: this.asInputJsonValue(dto.amenities ?? []),
          hourlyRate: dto.hourlyRate,
          imageUrl: dto.imageUrl,
          status: dto.status ?? LoungeStatus.ACTIVE,
          location: dto.location,
          loungeType: dto.loungeType,
          maxBookings: dto.maxBookings,
          availableDays: this.asInputJsonValue(dto.availableDays ?? []),
          timeSlots: this.asInputJsonValue(dto.timeSlots ?? []),
          createdBy: user.id,
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new UnprocessableEntityException(
        "Erreur lors de la création du salon d'honneur.",
      );
    }
  }

  async findAll(params: LoungeSearchDto, user?: User) {
    try {
      if (user && !this.canAccessLoungeModule(user)) {
        throw new BadRequestException(
          "Vous n'avez pas les permissions pour accéder au module salon d'honneur.",
        );
      }

      const where: Prisma.LoungeWhereInput = {};

      if (params.search) {
        where.OR = [
          { name: { contains: params.search, mode: 'insensitive' } },
          { location: { contains: params.search, mode: 'insensitive' } },
          { description: { contains: params.search, mode: 'insensitive' } },
        ];
      }

      if (params.status && Object.values(LoungeStatus).includes(params.status)) {
        where.status = params.status;
      }

      if (user && !this.canManageLounges(user)) {
        where.status = LoungeStatus.ACTIVE;
      }

      const paginationOptions: Prisma.LoungeFindManyArgs = {};
      if (params.page !== undefined && params.limit !== undefined) {
        paginationOptions.skip = (params.page - 1) * params.limit;
        paginationOptions.take = params.limit;
      }

      const [rows, total] = await Promise.all([
        this.prisma.lounge.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          ...paginationOptions,
        }),
        this.prisma.lounge.count({ where }),
      ]);

      return {
        ...new PaginationMeta(params.page || 1, params.limit || rows.length, total),
        data: rows,
      };
    } catch {
      throw new UnprocessableEntityException(
        "Erreur lors de la récupération des salons d'honneur.",
      );
    }
  }

  async findOne(id: string, user?: User) {
    if (user && !this.canAccessLoungeModule(user)) {
      throw new BadRequestException(
        "Vous n'avez pas les permissions pour accéder au module salon d'honneur.",
      );
    }

    const lounge = await this.prisma.lounge.findUnique({
      where: { id },
    });

    if (!lounge) {
      throw new NotFoundException('Salon introuvable.');
    }

    if (user && !this.canManageLounges(user) && lounge.status !== LoungeStatus.ACTIVE) {
      throw new NotFoundException('Salon introuvable.');
    }

    return lounge;
  }

  async updateLounge(id: string, dto: UpdateLoungeDto, user: User) {
    try {
      if (!this.canAccessLoungeModule(user) || !this.canManageLounges(user)) {
        throw new BadRequestException(
          "Vous n'avez pas les permissions pour modifier un salon.",
        );
      }

      const oldLounge = await this.prisma.lounge.findUnique({ where: { id } });
      if (!oldLounge) {
        throw new NotFoundException('Salon introuvable.');
      }

      return await this.prisma.lounge.update({
        where: { id },
        data: {
          ...dto,
          amenities: this.asInputJsonValue(dto.amenities ?? oldLounge.amenities),
          availableDays: this.asInputJsonValue(
            dto.availableDays ?? oldLounge.availableDays,
          ),
          timeSlots: this.asInputJsonValue(dto.timeSlots ?? oldLounge.timeSlots),
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new UnprocessableEntityException(
        "Erreur lors de la mise à jour du salon d'honneur.",
      );
    }
  }

  async removeLounge(id: string, user: User) {
    try {
      if (!this.canAccessLoungeModule(user) || !this.canManageLounges(user)) {
        throw new BadRequestException(
          "Vous n'avez pas les permissions pour supprimer un salon.",
        );
      }

      const oldLounge = await this.prisma.lounge.findUnique({ where: { id } });
      if (!oldLounge) {
        throw new NotFoundException('Salon introuvable.');
      }

      await this.prisma.lounge.delete({ where: { id } });
      return { message: "Salon d'honneur supprimé avec succès." };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new UnprocessableEntityException(
        "Erreur lors de la suppression du salon d'honneur.",
      );
    }
  }

  async createBooking(user: User, dto: CreateLoungeBookingDto) {
    try {
      if (!this.canAccessLoungeModule(user)) {
        throw new BadRequestException(
          "Vous n'avez pas les permissions pour créer une réservation.",
        );
      }

      const lounge = await this.prisma.lounge.findUnique({
        where: { id: dto.loungeId },
      });

      if (!lounge) {
        throw new NotFoundException('Salon introuvable.');
      }

      if (lounge.status !== LoungeStatus.ACTIVE) {
        throw new BadRequestException(
          "Ce salon d'honneur n'est pas disponible actuellement.",
        );
      }

      if (dto.numGuests > lounge.capacity) {
        throw new BadRequestException(
          `Le nombre d'invités ne doit pas dépasser ${lounge.capacity}.`,
        );
      }

      const startTime = new Date(dto.startTime);
      const endTime = new Date(dto.endTime);

      if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
        throw new BadRequestException('Les dates de réservation sont invalides.');
      }

      if (endTime <= startTime) {
        throw new BadRequestException(
          "L'heure de fin doit être postérieure à l'heure de début.",
        );
      }

      const overlap = await this.prisma.loungeBooking.findFirst({
        where: {
          loungeId: dto.loungeId,
          status: { in: [LoungeBookingStatus.PENDING, LoungeBookingStatus.CONFIRMED] },
          NOT: [{ endTime: { lte: startTime } }, { startTime: { gte: endTime } }],
        },
      });

      if (overlap) {
        throw new BadRequestException(
          'Ce salon est déjà réservé sur la plage sélectionnée.',
        );
      }

      const userId = this.canManageLounges(user) && dto.userId ? dto.userId : user.id;
      const hours = Math.max(
        0,
        (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60),
      );
      const computedAmount = Number((hours * Number(lounge.hourlyRate)).toFixed(2));
      const totalAmount = dto.totalAmount ?? computedAmount;

      const booking = await this.prisma.loungeBooking.create({
        data: {
          loungeId: dto.loungeId,
          userId,
          startTime,
          endTime,
          numGuests: dto.numGuests,
          status: LoungeBookingStatus.PENDING,
          totalAmount,
          specialRequests: dto.specialRequests,
          paymentMethod: dto.paymentMethod ?? LoungePaymentMethod.ON_SITE,
          paymentStatus: dto.paymentStatus ?? LoungePaymentStatus.PENDING,
          guestFirstName: dto.guestFirstName,
          guestLastName: dto.guestLastName,
          guestFunction: dto.guestFunction,
          guestPhone: dto.guestPhone,
          guestOrganization: dto.guestOrganization,
          guestNationality: dto.guestNationality,
          airline: dto.airline,
          flightNumber: dto.flightNumber,
          flightOrigin: dto.flightOrigin,
          flightArrivalTime: dto.flightArrivalTime
            ? new Date(dto.flightArrivalTime)
            : undefined,
          companions: this.asInputJsonValue(dto.companions ?? []),
          histories: {
            create: {
              action: 'created',
              newStatus: LoungeBookingStatus.PENDING,
              notes: 'Réservation créée',
              processedBy: user.id,
            },
          },
        },
      });

      return booking;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new UnprocessableEntityException(
        'Erreur lors de la création de la réservation du salon.',
      );
    }
  }

  async findBookings(user: User, params: LoungeBookingSearchDto) {
    try {
      if (!this.canAccessLoungeModule(user)) {
        throw new BadRequestException(
          "Vous n'avez pas les permissions pour consulter les réservations.",
        );
      }

      const where: Prisma.LoungeBookingWhereInput = {};

      if (params.search) {
        where.OR = [
          { guestFirstName: { contains: params.search, mode: 'insensitive' } },
          { guestLastName: { contains: params.search, mode: 'insensitive' } },
          { guestOrganization: { contains: params.search, mode: 'insensitive' } },
          { lounge: { name: { contains: params.search, mode: 'insensitive' } } },
        ];
      }

      if (
        params.bookingStatus &&
        Object.values(LoungeBookingStatus).includes(params.bookingStatus)
      ) {
        where.status = params.bookingStatus;
      }

      if (params.loungeId) {
        where.loungeId = params.loungeId;
      }

      if (params.userId) {
        where.userId = params.userId;
      }

      if (!this.canManageLounges(user)) {
        where.userId = user.id;
      }

      const paginationOptions: Prisma.LoungeBookingFindManyArgs = {};
      if (params.page !== undefined && params.limit !== undefined) {
        paginationOptions.skip = (params.page - 1) * params.limit;
        paginationOptions.take = params.limit;
      }

      const [rows, total] = await Promise.all([
        this.prisma.loungeBooking.findMany({
          where,
          include: {
            lounge: true,
            histories: {
              orderBy: { createdAt: 'desc' },
            },
          },
          orderBy: { createdAt: 'desc' },
          ...paginationOptions,
        }),
        this.prisma.loungeBooking.count({ where }),
      ]);

      return {
        ...new PaginationMeta(params.page || 1, params.limit || rows.length, total),
        data: rows,
      };
    } catch {
      throw new UnprocessableEntityException(
        'Erreur lors de la récupération des réservations.',
      );
    }
  }

  async getBookingById(id: string, user: User) {
    if (!this.canAccessLoungeModule(user)) {
      throw new BadRequestException(
        "Vous n'avez pas les permissions pour consulter cette réservation.",
      );
    }

    const booking = await this.prisma.loungeBooking.findUnique({
      where: { id },
      include: {
        lounge: true,
        histories: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Réservation introuvable.');
    }

    if (!this.canManageLounges(user) && booking.userId !== user.id) {
      throw new NotFoundException('Réservation introuvable.');
    }

    return booking;
  }

  async updateBookingStatus(
    id: string,
    user: User,
    dto: UpdateLoungeBookingStatusDto,
  ) {
    try {
      if (!this.canAccessLoungeModule(user)) {
        throw new BadRequestException(
          "Vous n'avez pas les permissions pour modifier cette réservation.",
        );
      }

      const booking = await this.prisma.loungeBooking.findUnique({
        where: { id },
      });
      if (!booking) {
        throw new NotFoundException('Réservation introuvable.');
      }

      const isOwner = booking.userId === user.id;
      const canManage = this.canConfirmOrCancel(user);

      if (!canManage) {
        if (!(isOwner && dto.status === LoungeBookingStatus.CANCELLED)) {
          throw new BadRequestException(
            "Vous n'avez pas les permissions pour cette action.",
          );
        }
      }

      if (
        dto.status === LoungeBookingStatus.CONFIRMED &&
        !this.canConfirmOrCancel(user)
      ) {
        throw new BadRequestException(
          "Vous n'avez pas les permissions pour confirmer une réservation.",
        );
      }

      const updated = await this.prisma.loungeBooking.update({
        where: { id },
        data: {
          status: dto.status,
          adminNotes: dto.adminNotes ?? booking.adminNotes,
          processedBy: user.id,
          processedAt: new Date(),
          paymentStatus: dto.paymentStatus ?? booking.paymentStatus,
        },
      });

      await this.prisma.loungeBookingHistory.create({
        data: {
          bookingId: id,
          action: 'status_update',
          oldStatus: booking.status,
          newStatus: dto.status,
          notes: dto.adminNotes,
          processedBy: user.id,
        },
      });

      return updated;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new UnprocessableEntityException(
        'Erreur lors de la mise à jour de la réservation.',
      );
    }
  }

  async getBookingHistory(id: string, user: User) {
    if (!this.canAccessLoungeModule(user)) {
      throw new BadRequestException(
        "Vous n'avez pas les permissions pour consulter l'historique.",
      );
    }

    const booking = await this.prisma.loungeBooking.findUnique({
      where: { id },
      include: {
        histories: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Réservation introuvable.');
    }

    if (!this.canManageLounges(user) && booking.userId !== user.id) {
      throw new NotFoundException('Réservation introuvable.');
    }

    return booking.histories;
  }
}
