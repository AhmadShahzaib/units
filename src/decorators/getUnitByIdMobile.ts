import { Get, HttpStatus, SetMetadata } from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';

import {
  CombineDecorators,
  CombineDecoratorType,
  ELD,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { UnitResponse } from '../models/unitResponse.model';

export default function GetByIdDecoratorsMobile() {
  const GetByIdDecoratorsMobile: Array<CombineDecoratorType> = [
    Get('/mobile'),
    SetMetadata('permissions', [ELD.GETBYID]),
    ApiBearerAuth('access-token'),
    ApiResponse({ status: HttpStatus.OK, type: UnitResponse }),
  ];
  return CombineDecorators(GetByIdDecoratorsMobile);
}
