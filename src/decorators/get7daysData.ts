import { Get, HttpStatus, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';

import {
  CombineDecorators,
  CombineDecoratorType,
  DRIVER,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { sortableAttributes } from '../models';

export default function GetDrivers7daysDecorators() {
  const GetDrivers7daysDecorators: Array<CombineDecoratorType> = [
    Get('weekLogs'),
    SetMetadata('permissions', [DRIVER.LIST]),
    ApiBearerAuth('access-token'),
    ApiResponse({
      status: HttpStatus.OK,
      content: {},
    })
  
  ];
  return CombineDecorators(GetDrivers7daysDecorators);
}
