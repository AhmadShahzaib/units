import { Get, HttpStatus, SetMetadata } from '@nestjs/common';

import { ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';

import {
  CombineDecorators,
  CombineDecoratorType,
  UNITS,DRIVER
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { sortableAttributes } from '../models';
let responseExample = {
  data: [
    {
      id: '62e3650bd9aa36f826be8a9b',
      driverId: '62e3772a82708ee2d74dd2c1',
      vehicleId: '62e3673b097580273888b650',
      deviceId: '62e3650b0e7e6d3d2f5be453',
      deviceVendor: 'ALI',
      deviceSerialNo: 'SR-06',
      vehicleLicensePlateNo: 'ALI-05',
      vehicleMake: 'HONDA',
      manualVehicleId: 'V-05',
      eldNo: 'E-06',
      manualDriverId: 'driver-john-doe',
      driverFirstName: 'Library',
      driverLastName: 'Doe',
      isDriverActive: true,
      isVehicleActive: true,
      isDeviceActive: true,
      isActive: true,
    },
  ],
  total: 5,
  pageNo: 1,
  last_page: 1,
};

export default function GetLogsDecorators() {
  const GetLogsDecorators: Array<CombineDecoratorType> = [
    Get(`/logs`),
    SetMetadata('permissions', [DRIVER.LIST]),
    ApiBearerAuth('access-token'),
    ApiResponse({
      status: HttpStatus.OK,
      content: {
        'application/json': {
          examples: {
            'example 1': { value: responseExample },
          },
        },
      },
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
  return CombineDecorators(GetLogsDecorators);
}
