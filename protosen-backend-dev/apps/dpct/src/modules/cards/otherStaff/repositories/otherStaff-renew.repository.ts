import { ICreateRenewSpouseDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { BaseSharedDCRepo } from '@shared/repositories/sharedDC.repository';
import db, { RenewOtherStaffDC, OtherStaffDC, OtherStaffDCFile } from 'database/models';

export class RenewOtherStaffDCRepo extends BaseSharedDCRepo<
	RenewOtherStaffDC,
	ICreateRenewSpouseDC,
	IUpdateRenewSpouseDC
> {
	model = db.RenewOtherStaffDC;
	includeModel = OtherStaffDC;
	includeFileModel = OtherStaffDCFile;
	fileAssociationName = 'otherStaffDCFiles';
}
