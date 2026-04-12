import { ICreateRenewSpouseDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { BaseSharedDCRepo } from '@shared/repositories/sharedDC.repository';
import db, { RenewChildDC, ChildDC, ChildDCFile } from '@database/models';

export class RenewChildDCRepo extends BaseSharedDCRepo<
	RenewChildDC,
	ICreateRenewSpouseDC,
	IUpdateRenewSpouseDC
> {
	model = db.RenewChildDC;
	includeModel = ChildDC;
	includeFileModel = ChildDCFile;
	fileAssociationName = 'childDCFiles';
}
