import { Get, HttpStatus, SetMetadata } from '@nestjs/common';

import { ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';

import {
  CombineDecorators,
  CombineDecoratorType,
  UNITS,DRIVER
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { sortableAttributes } from '../models';


export default function allcurrentStatusesDecorators() {
  const allcurrentStatusesDecorators: Array<CombineDecoratorType> = [
    Get("/allcurrentStatuses"),
    SetMetadata('permissions', ["d41e39f3a"]),
    ApiBearerAuth('access-token'),
    ApiResponse({
      status: HttpStatus.OK,
     
    }),
    ApiQuery({
      name: 'search',
      example:
        'search by  vehicleMake,driverFirstName,deviceVendor,deviceSerialNo,vehicleLicensePlateNo,eldNo,driverFirstName,driverLastName,manualVehicleId,manualDriverId',
      required: false,
    }),
    ApiQuery({
      name: 'orderBy',
      example: 'Field by which record will be ordered',
      required: false,
      enum: sortableAttributes,
    }),
    ApiQuery({
      name: 'orderType',
      example: 'Ascending(1),Descending(-1)',
      enum: [1, -1],
      required: false,
    }),
    ApiQuery({
      name: 'pageNo',
      example: '1',
      description: 'The pageNo you want to get e.g 1,2,3 etc',
      required: false,
    }),
  ];
  return CombineDecorators(allcurrentStatusesDecorators);
}
