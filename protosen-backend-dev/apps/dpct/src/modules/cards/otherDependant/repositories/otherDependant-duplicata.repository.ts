import { ICreateDuplicataDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { BaseDuplicataDCRepo } from '@shared/repositories/sharedDC.repository';
import db, { OtherDependantDuplicataDC, OtherDependantDC, RenewOtherDependantDC } from '@database/models';

export class OtherDependantDuplicataDCRepo extends BaseDuplicataDCRepo<
	OtherDependantDuplicataDC,
	ICreateDuplicataDC,
	IUpdateRenewSpouseDC
> {
	model = db.OtherDependantDuplicataDC;
	includeModel = OtherDependantDC;
	renewIncludeModel = RenewOtherDependantDC;
}
