import { ICreateRenewSpouseDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { BaseSharedDCRepo } from '@shared/repositories/sharedDC.repository';
import db, {
	RenewDomesticAndRelativeDC,
	DomesticAndRelativeDC,
	DomesticAndRelativeDCFile,
} from '@database/models';

export class RenewDomesticAndRelativeDCRepo extends BaseSharedDCRepo<
	RenewDomesticAndRelativeDC,
	ICreateRenewSpouseDC,
	IUpdateRenewSpouseDC
> {
	model = db.RenewDomesticAndRelativeDC;
	includeModel = DomesticAndRelativeDC;
	includeFileModel = DomesticAndRelativeDCFile;
	fileAssociationName = 'domesticAndRelativeDCFiles';
}
