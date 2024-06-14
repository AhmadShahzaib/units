import { HttpStatus, Post, Put, SetMetadata } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import {
  CombineDecorators,
  CombineDecoratorType,
  DRIVER,
  ErrorType,
  GetOperationId,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { UnitEditRequest } from 'models/editUnitRequestModel';
import { UnitResponse } from '../models/unitResponse.model';

export default function UpdateByIdDecoratorsMobile() {
  const example1: UnitEditRequest = {
    vehicleId: 'string',
    headOfficeId: 'string',
    homeTerminalAddressId: 'string',
    shipingDocument: 'string',
    trailerNumber: 'string',
  };
  const UpdateByIdDecoratorsMobile: Array<CombineDecoratorType> = [
    Put('/mobile'),
    ApiBearerAuth('access-token'),
    ApiConsumes('multipart/form-data'),
    SetMetadata('permissions', [DRIVER.EDIT]),
    ApiExtraModels(UnitEditRequest),
    ApiBody({
      examples: {
        'example 1': { value: example1 },
      },
      schema: {
        $ref: getSchemaPath(UnitEditRequest),
      },
    }),
    ApiOkResponse({
      content: {
        'application/json': {
          examples: {
            'example 1': { value: UnitEditRequest },
          },
        },
      },
    }),
    ApiResponse({ status: HttpStatus.CONFLICT, type: ErrorType }),
    ApiOperation(GetOperationId('UNITS', 'logForm')),
  ];
  return CombineDecorators(UpdateByIdDecoratorsMobile);
}
