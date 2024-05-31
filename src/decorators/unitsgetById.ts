import { Get, HttpStatus, SetMetadata } from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';

import {
  CombineDecorators,
  CombineDecoratorType,
  DRIVER,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { UnitResponse } from '../models/unitResponse.model';

export default function GetByIdDecorators() {
  const GetByIdDecorators: Array<CombineDecoratorType> = [
    Get(':driverId'),
    SetMetadata('permissions', [DRIVER.GETBYID]),
    ApiBearerAuth('access-token'),
    ApiResponse({ status: HttpStatus.OK, type: UnitResponse }),
    ApiParam({
      name: 'driverId',
      description: 'The Driver ID you want to get Unit data.',
    }),
  ];
  return CombineDecorators(GetByIdDecorators);
}
