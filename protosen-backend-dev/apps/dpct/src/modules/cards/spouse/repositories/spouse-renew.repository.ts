import { ICreateRenewSpouseDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { BaseSharedDCRepo } from '@shared/repositories/sharedDC.repository';
import db, { RenewSpouseDC, SpouseDC, SpouseDCFile } from 'database/models';

export class RenewSpouseDCRepo extends BaseSharedDCRepo<
	RenewSpouseDC,
	ICreateRenewSpouseDC,
	IUpdateRenewSpouseDC
> {
	model = db.RenewSpouseDC;
	includeModel = SpouseDC;
	includeFileModel = SpouseDCFile;
	fileAssociationName = 'spouseDCFiles';
}
