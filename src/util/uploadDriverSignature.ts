import { AwsService } from '@shafiqrathore/logeld-tenantbackend-common-future';
import { UnitService } from 'app.service';
import { UnitEditRequest } from 'models/editUnitRequestModel';
import moment from 'moment';
import UnitDocument from 'mongoDb/document/document';

export const uploadDriverSignature = async (
  driverId: string,
  tenantId: string,
  awsService: AwsService,
  editRequestData: UnitEditRequest,
  file = null,
) => {
  try {
    if (file && file?.buffer?.length > 0) {
      const resUrl = await awsService.uploadFile(
        file.buffer,
        `${tenantId}/${driverId}/Signatures/${moment().unix()}-${
          file?.originalname
        }`,
        file.name,
      );
      editRequestData['imageKey'] = resUrl.key;
    }
    return editRequestData;
  } catch (err) {
    throw err;
  }
};
