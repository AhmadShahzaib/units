import { AwsService } from '@shafiqrathore/logeld-tenantbackend-common-future';
import { UnitService } from 'app.service';
import UnitDocument from 'mongoDb/document/document';
import { Schema } from 'mongoose';

export const getUnitByDriverId = async (
  driverId: string,
  data: UnitDocument,
  date: string,
  unitService: UnitService,
  awsService: AwsService,
  tenantId: Schema.Types.ObjectId,
) => {
  let path;
  let carrier = await unitService.getCompany(tenantId);
  if (data?.imageKey) {
    path = await awsService.getObject(data.imageKey);
    data['imagePath'] = `data:image/${data.imageName
      .split('.')
      .pop()};base64,${path.replace(/\s+/g, '')}`;
    delete data['imageKey'];
  }
  let resGraph = await unitService.findGraph(driverId, date, tenantId);
  if (resGraph) {
    data['odometerEnd'] = resGraph[resGraph.length - 1]?.odoMeterSpeed;
    data['engineStart'] = resGraph[0]?.engineHours;
    data['distance'] =
      resGraph.length > 1
        ? resGraph[resGraph.length - 1]?.odoMeterMillage -
          resGraph[0]?.odoMeterMillage
        : resGraph[0]?.odoMeterMillage;
    data['from'] = resGraph[0]?.geoLocation?.address ?? '';
    data['to'] = resGraph[resGraph.length - 1]?.geoLocation?.address ?? '';
  }
  data['carrier'] = carrier?.name;
  return data;
};
