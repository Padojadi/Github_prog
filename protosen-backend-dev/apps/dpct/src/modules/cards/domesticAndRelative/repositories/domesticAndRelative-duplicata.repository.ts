import { ICreateDuplicataDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { BaseDuplicataDCRepo } from '@shared/repositories/sharedDC.repository';
import db, { DomesticAndRelativeDuplicataDC, DomesticAndRelativeDC, RenewDomesticAndRelativeDC } from '@database/models';

export class DomesticAndRelativeDuplicataDCRepo extends BaseDuplicataDCRepo<
	DomesticAndRelativeDuplicataDC,
	ICreateDuplicataDC,
	IUpdateRenewSpouseDC
> {
	model = db.DomesticAndRelativeDuplicataDC;
	includeModel = DomesticAndRelativeDC;
	renewIncludeModel = RenewDomesticAndRelativeDC;
}
