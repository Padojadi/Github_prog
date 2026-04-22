import { ICreateDuplicataDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { BaseDuplicataDCRepo } from '@shared/repositories/sharedDC.repository';
import db, { ChildDuplicataDC, ChildDC, RenewChildDC } from '@database/models';

export class ChildDuplicataDCRepo extends BaseDuplicataDCRepo<
	ChildDuplicataDC,
	ICreateDuplicataDC,
	IUpdateRenewSpouseDC
> {
	model = db.ChildDuplicataDC;
	includeModel = ChildDC;
	renewIncludeModel = RenewChildDC;
}
