import { ICreateDuplicataDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { BaseDuplicataDCRepo } from '@shared/repositories/sharedDC.repository';
import db, { OtherStaffDuplicataDC, OtherStaffDC, RenewOtherStaffDC } from 'database/models';

export class OtherStaffDuplicataDCRepo extends BaseDuplicataDCRepo<
	OtherStaffDuplicataDC,
	ICreateDuplicataDC,
	IUpdateRenewSpouseDC
> {
	model = db.OtherStaffDuplicataDC;
	includeModel = OtherStaffDC;
	renewIncludeModel = RenewOtherStaffDC;
}
