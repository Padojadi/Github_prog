import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { api_code } from 'src/constants/api.codes';
import {
  CreateVipAccessRequestDto,
  CreateVipBookingDto,
  CreateVipLoungeDto,
  UpdateVipAccessRequestStatusDto,
  UpdateVipBookingStatusDto,
  UpdateVipLoungeDto,
} from './dto/vip-lounge.dto';

type AuthUser = {
  id: string;
  role: string;
};

@Injectable()
export class VipLoungeService {
  constructor(private readonly prisma: PrismaService) {}

  private isAdminRole(user: AuthUser) {
    return user.role === 'admin' || user.role === 'super_admin';
  }

  private mapLoungeRow(row: any) {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      capacity: Number(row.capacity ?? 0),
      amenities: row.amenities ?? [],
      hourlyRate: Number(row.hourly_rate ?? 0),
      imageUrl: row.image_url,
      status: row.status,
      location: row.location,
      availableDays: row.available_days ?? [],
      timeSlots: row.time_slots ?? [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapBookingRow(row: any) {
    return {
      id: row.id,
      loungeId: row.lounge_id,
      userId: row.user_id,
      startTime: row.start_time,
      endTime: row.end_time,
      numGuests: Number(row.num_guests ?? 0),
      status: row.status,
      totalAmount: Number(row.total_amount ?? 0),
      specialRequests: row.special_requests,
      adminNotes: row.admin_notes,
      processedBy: row.processed_by,
      processedAt: row.processed_at,
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status,
      qrCodeData: row.qr_code_data,
      guestFirstName: row.guest_first_name,
      guestLastName: row.guest_last_name,
      guestFunction: row.guest_function,
      guestPhone: row.guest_phone,
      guestOrganization: row.guest_organization,
      guestNationality: row.guest_nationality,
      airline: row.airline,
      flightNumber: row.flight_number,
      flightOrigin: row.flight_origin,
      flightArrivalTime: row.flight_arrival_time,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lounge: row.lounge_id
        ? {
            id: row.lounge_id,
            name: row.lounge_name,
            location: row.lounge_location,
            status: row.lounge_status,
          }
        : null,
    };
  }

  private mapAccessRequestRow(row: any) {
    return {
      id: row.id,
      userId: row.user_id,
      firstName: row.first_name,
      lastName: row.last_name,
      function: row.function,
      phone: row.phone,
      organization: row.organization,
      nationality: row.nationality,
      passportType: row.passport_type,
      passportNumber: row.passport_number,
      travelPurpose: row.travel_purpose,
      companionType: row.companion_type,
      familyRelation: row.family_relation,
      familyMembers: row.family_members ?? [],
      delegationMembers: row.delegation_members ?? [],
      airline: row.airline,
      flightNumber: row.flight_number,
      flightOrigin: row.flight_origin,
      flightArrivalTime: row.flight_arrival_time,
      startTime: row.start_time,
      endTime: row.end_time,
      specialRequests: row.special_requests,
      status: row.status,
      adminNotes: row.admin_notes,
      processedBy: row.processed_by,
      processedAt: row.processed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private calculateAmount(hourlyRate: number, startTime: Date, endTime: Date) {
    const diffMs = endTime.getTime() - startTime.getTime();
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    return Math.max(0, hours) * hourlyRate;
  }

  private generateQrPayload(id: string, userId: string, loungeId: string) {
    return JSON.stringify({
      bookingId: id,
      userId,
      loungeId,
      type: 'vip-lounge-booking',
      issuedAt: new Date().toISOString(),
    });
  }

  async getLounges() {
    try {
      const rows = await this.prisma.$queryRawUnsafe<any[]>(
        `
          SELECT *
          FROM vip_lounges
          ORDER BY name ASC
        `,
      );
      return rows.map((row) => this.mapLoungeRow(row));
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_222);
    }
  }

  async getLoungeById(id: string) {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `
        SELECT *
        FROM vip_lounges
        WHERE id = $1
      `,
      id,
    );

    if (!rows.length) {
      throw new NotFoundException(api_code.MSG_218);
    }

    return this.mapLoungeRow(rows[0]);
  }

  async createLounge(dto: CreateVipLoungeDto, user: AuthUser) {
    if (!this.isAdminRole(user)) {
      throw new BadRequestException(api_code.MSG_234);
    }

    try {
      const rows = await this.prisma.$queryRawUnsafe<any[]>(
        `
          INSERT INTO vip_lounges (
            name,
            description,
            capacity,
            amenities,
            hourly_rate,
            image_url,
            status,
            location,
            available_days,
            time_slots
          )
          VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8, $9::jsonb, $10::jsonb)
          RETURNING *
        `,
        dto.name,
        dto.description ?? null,
        dto.capacity,
        JSON.stringify(dto.amenities ?? []),
        dto.hourlyRate,
        dto.imageUrl ?? null,
        dto.status ?? 'active',
        dto.location,
        JSON.stringify(dto.availableDays ?? []),
        JSON.stringify(dto.timeSlots ?? []),
      );

      return this.mapLoungeRow(rows[0]);
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_216);
    }
  }

  async updateLounge(id: string, dto: UpdateVipLoungeDto, user: AuthUser) {
    if (!this.isAdminRole(user)) {
      throw new BadRequestException(api_code.MSG_234);
    }

    await this.getLoungeById(id);

    try {
      const rows = await this.prisma.$queryRawUnsafe<any[]>(
        `
          UPDATE vip_lounges
          SET
            name = COALESCE($2, name),
            description = COALESCE($3, description),
            capacity = COALESCE($4, capacity),
            amenities = COALESCE($5::jsonb, amenities),
            hourly_rate = COALESCE($6, hourly_rate),
            image_url = COALESCE($7, image_url),
            status = COALESCE($8, status),
            location = COALESCE($9, location),
            available_days = COALESCE($10::jsonb, available_days),
            time_slots = COALESCE($11::jsonb, time_slots),
            updated_at = NOW()
          WHERE id = $1
          RETURNING *
        `,
        id,
        dto.name ?? null,
        dto.description ?? null,
        dto.capacity ?? null,
        dto.amenities ? JSON.stringify(dto.amenities) : null,
        dto.hourlyRate ?? null,
        dto.imageUrl ?? null,
        dto.status ?? null,
        dto.location ?? null,
        dto.availableDays ? JSON.stringify(dto.availableDays) : null,
        dto.timeSlots ? JSON.stringify(dto.timeSlots) : null,
      );

      return this.mapLoungeRow(rows[0]);
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_219);
    }
  }

  async deleteLounge(id: string, user: AuthUser) {
    if (!this.isAdminRole(user)) {
      throw new BadRequestException(api_code.MSG_234);
    }

    await this.getLoungeById(id);

    try {
      await this.prisma.$queryRawUnsafe(
        `
          DELETE FROM vip_lounges
          WHERE id = $1
        `,
        id,
      );
      return { message: 'Lounge deleted successfully' };
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_220);
    }
  }

  async createBooking(dto: CreateVipBookingDto, user: AuthUser) {
    const lounge = await this.getLoungeById(dto.loungeId);
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (!(end > start)) {
      throw new BadRequestException('Invalid booking window');
    }

    if (dto.numGuests > lounge.capacity) {
      throw new BadRequestException('Guest count exceeds lounge capacity');
    }

    const overlapRows = await this.prisma.$queryRawUnsafe<any[]>(
      `
        SELECT id
        FROM vip_bookings
        WHERE lounge_id = $1
          AND status IN ('pending', 'confirmed')
          AND start_time < $3
          AND end_time > $2
        LIMIT 1
      `,
      dto.loungeId,
      start.toISOString(),
      end.toISOString(),
    );

    if (overlapRows.length) {
      throw new BadRequestException('Lounge is not available for this time range');
    }

    try {
      const amount = this.calculateAmount(lounge.hourlyRate, start, end);
      const rows = await this.prisma.$queryRawUnsafe<any[]>(
        `
          INSERT INTO vip_bookings (
            lounge_id,
            user_id,
            start_time,
            end_time,
            num_guests,
            status,
            total_amount,
            special_requests,
            payment_method,
            payment_status
          )
          VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, $8, 'pending')
          RETURNING *
        `,
        dto.loungeId,
        user.id,
        start.toISOString(),
        end.toISOString(),
        dto.numGuests,
        amount,
        dto.specialRequests ?? null,
        dto.paymentMethod ?? 'on_site',
      );
      const booking = rows[0];
      return this.mapBookingRow(booking);
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_222);
    }
  }

  async getMyBookings(user: AuthUser) {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `
        SELECT
          b.*,
          l.name as lounge_name,
          l.location as lounge_location,
          l.status as lounge_status
        FROM vip_bookings b
        LEFT JOIN vip_lounges l ON l.id = b.lounge_id
        WHERE b.user_id = $1
        ORDER BY b.start_time DESC
      `,
      user.id,
    );

    return rows.map((row) => this.mapBookingRow(row));
  }

  async getAllBookings(user: AuthUser) {
    if (!this.isAdminRole(user)) {
      throw new BadRequestException(api_code.MSG_234);
    }
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `
        SELECT
          b.*,
          l.name as lounge_name,
          l.location as lounge_location,
          l.status as lounge_status
        FROM vip_bookings b
        LEFT JOIN vip_lounges l ON l.id = b.lounge_id
        ORDER BY b.start_time DESC
      `,
    );
    return rows.map((row) => this.mapBookingRow(row));
  }

  async updateBookingStatus(
    id: string,
    dto: UpdateVipBookingStatusDto,
    user: AuthUser,
  ) {
    if (!this.isAdminRole(user)) {
      throw new BadRequestException(api_code.MSG_234);
    }

    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `
        SELECT *
        FROM vip_bookings
        WHERE id = $1
      `,
      id,
    );

    if (!rows.length) {
      throw new NotFoundException(api_code.MSG_224);
    }

    const current = rows[0];
    const qrData =
      dto.status === 'confirmed'
        ? this.generateQrPayload(current.id, current.user_id, current.lounge_id)
        : current.qr_code_data;

    const updated = await this.prisma.$queryRawUnsafe<any[]>(
      `
        UPDATE vip_bookings
        SET
          status = $2,
          admin_notes = COALESCE($3, admin_notes),
          processed_by = $4,
          processed_at = NOW(),
          payment_status = CASE
            WHEN $2 = 'confirmed' THEN 'completed'
            WHEN $2 = 'cancelled' THEN 'failed'
            ELSE payment_status
          END,
          qr_code_data = $5,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      id,
      dto.status,
      dto.adminNotes ?? null,
      user.id,
      qrData,
    );

    await this.prisma.$queryRawUnsafe(
      `
        INSERT INTO vip_booking_history (
          booking_id,
          action,
          old_status,
          new_status,
          notes,
          processed_by
        )
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      id,
      `status:${dto.status}`,
      current.status,
      dto.status,
      dto.adminNotes ?? null,
      user.id,
    );

    return this.mapBookingRow(updated[0]);
  }

  async getBookingHistory(user: AuthUser) {
    if (!this.isAdminRole(user)) {
      throw new BadRequestException(api_code.MSG_234);
    }

    return this.prisma.$queryRawUnsafe<any[]>(
      `
        SELECT *
        FROM vip_booking_history
        ORDER BY created_at DESC
      `,
    );
  }

  async createAccessRequest(dto: CreateVipAccessRequestDto, user: AuthUser) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    if (!(end > start)) {
      throw new BadRequestException('Invalid access request time range');
    }

    try {
      const rows = await this.prisma.$queryRawUnsafe<any[]>(
        `
          INSERT INTO vip_access_requests (
            user_id,
            first_name,
            last_name,
            function,
            phone,
            organization,
            nationality,
            passport_type,
            passport_number,
            travel_purpose,
            companion_type,
            family_relation,
            family_members,
            delegation_members,
            airline,
            flight_number,
            flight_origin,
            flight_arrival_time,
            start_time,
            end_time,
            special_requests,
            status
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,
            $10, $11, $12, $13::jsonb, $14::jsonb, $15, $16, $17, $18,
            $19, $20, $21, 'pending'
          )
          RETURNING *
        `,
        user.id,
        dto.firstName,
        dto.lastName,
        dto.function,
        dto.phone,
        dto.organization,
        dto.nationality,
        dto.passportType,
        dto.passportNumber,
        dto.travelPurpose ?? null,
        dto.companionType ?? null,
        dto.familyRelation ?? null,
        JSON.stringify(dto.familyMembers ?? []),
        JSON.stringify(dto.delegationMembers ?? []),
        dto.airline ?? null,
        dto.flightNumber ?? null,
        dto.flightOrigin ?? null,
        dto.flightArrivalTime ?? null,
        start.toISOString(),
        end.toISOString(),
        dto.specialRequests ?? null,
      );

      return this.mapAccessRequestRow(rows[0]);
    } catch {
      throw new UnprocessableEntityException(api_code.MSG_222);
    }
  }

  async getMyAccessRequests(user: AuthUser) {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `
        SELECT *
        FROM vip_access_requests
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
      user.id,
    );

    return rows.map((row) => this.mapAccessRequestRow(row));
  }

  async getAllAccessRequests(user: AuthUser) {
    if (!this.isAdminRole(user)) {
      throw new BadRequestException(api_code.MSG_234);
    }
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `
        SELECT *
        FROM vip_access_requests
        ORDER BY created_at DESC
      `,
    );

    return rows.map((row) => this.mapAccessRequestRow(row));
  }

  async updateAccessRequestStatus(
    id: string,
    dto: UpdateVipAccessRequestStatusDto,
    user: AuthUser,
  ) {
    if (!this.isAdminRole(user)) {
      throw new BadRequestException(api_code.MSG_234);
    }

    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `
        SELECT *
        FROM vip_access_requests
        WHERE id = $1
      `,
      id,
    );

    if (!rows.length) {
      throw new NotFoundException(api_code.MSG_224);
    }

    const updated = await this.prisma.$queryRawUnsafe<any[]>(
      `
        UPDATE vip_access_requests
        SET
          status = $2,
          admin_notes = COALESCE($3, admin_notes),
          processed_by = $4,
          processed_at = NOW(),
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      id,
      dto.status,
      dto.adminNotes ?? null,
      user.id,
    );

    return this.mapAccessRequestRow(updated[0]);
  }
}
