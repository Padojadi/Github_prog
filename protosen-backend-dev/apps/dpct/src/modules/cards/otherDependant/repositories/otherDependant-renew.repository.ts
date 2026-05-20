import { ICreateRenewSpouseDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { BaseSharedDCRepo } from '@shared/repositories/sharedDC.repository';
import db, {
	RenewOtherDependantDC,
	OtherDependantDC,
	OtherDependantDCFile,
} from '@database/models';

export class RenewOtherDependantDCRepo extends BaseSharedDCRepo<
	RenewOtherDependantDC,
	ICreateRenewSpouseDC,
	IUpdateRenewSpouseDC
> {
	model = db.RenewOtherDependantDC;
	includeModel = OtherDependantDC;
	includeFileModel = OtherDependantDCFile;
	fileAssociationName = 'otherDependantDCFiles';
}
