import { Put, SetMetadata } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiParam,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  CombineDecorators,
  CombineDecoratorType,
  ELD,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { UnitEditRequest } from 'models/editUnitRequestModel';

export default function UpdateByIdDecorators() {
  let example1: UnitEditRequest = {
    vehicleId: 'string',
    headOfficeId: 'string',
    homeTerminalAddressId: 'string',
    shipingDocument: 'string',
    trailerNumber: 'string',
  };
  const UpdateByIdDecorators: Array<CombineDecoratorType> = [
    Put(':driverId'),
    ApiBearerAuth('access-token'),
    SetMetadata('permissions', [ELD.EDIT]),
    ApiBearerAuth('access-token'),
    ApiParam({
      name: 'driverId',
      description: 'The ID of the eld you want to update.',
    }),
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
  ];
  return CombineDecorators(UpdateByIdDecorators);
}
