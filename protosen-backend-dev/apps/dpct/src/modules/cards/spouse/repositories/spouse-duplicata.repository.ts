import { ICreateDuplicataDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { BaseDuplicataDCRepo } from '@shared/repositories/sharedDC.repository';
import db, { SpouseDuplicataDC, SpouseDC, RenewSpouseDC } from 'database/models';

export class SpouseDuplicataDCRepo extends BaseDuplicataDCRepo<
	SpouseDuplicataDC,
	ICreateDuplicataDC,
	IUpdateRenewSpouseDC
> {
	model = db.SpouseDuplicataDC;
	includeModel = SpouseDC;
	renewIncludeModel = RenewSpouseDC;
}
