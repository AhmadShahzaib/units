import { DeviceRequest } from './models/deviceRequestModel';
import { Express } from 'express';
import {
  BadRequestException,
  Controller,
  NotFoundException,
  UseInterceptors,
  Query,
  Res,
  Logger,
  HttpStatus,
  Req,
  Param,
  Body,
  UploadedFiles,
  UploadedFile,
  Inject,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { UnitService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { isActiveinActive } from 'models/active';
import {
  ListingParams,
  MongoIdValidationPipe,
  MessagePatternResponseInterceptor,
  BaseController,
  ListingParamsValidationPipe,
  AwsService,
  MessagePatternResponseType,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { Response } from 'express';
import mongoose, { FilterQuery, Types } from 'mongoose';
import UnitDocument from 'mongoDb/document/document';
import {
  DriverVehicleToUnitRequest,
  VehicleCustom,
} from './models/driverVehicleRequest';
import { DeviceVehicleRequest } from 'models/deviceVehicle';
import GetDecorators from './decorators/getUnits';
import GetTrackingDecorators from './decorators/getTrcaking';
import allcurrentStatusesDecorators from './decorators/allcurrentStatuses';
import { searchableAttributes } from './models';
import { sortableAttributes } from './models';
import { UnitResponse } from './models/unitResponse.model';
import { TrackingListing } from './models/trackingListing';

import { HOSData } from 'models/HOSData';
import GetByIdDecorators from 'decorators/unitsgetById';
import moment from 'moment';
import 'moment-timezone';
import UpdateByIdDecorators from 'decorators/updateUnitById';
import { getUnitByDriverId } from 'util/getById';
import { UnitEditRequest } from 'models/editUnitRequestModel';
// import { UnitUpdateByDriverId } from 'util/updateUnit';
import UpdateByIdDecoratorsMobile from 'decorators/updateUnitByIdMobile';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { Request } from 'express';
import GetLogsDecorators from 'decorators/getLogsUnits';
import GetByIdDecoratorsMobile from 'decorators/getUnitByIdMobile';
import { uploadDriverSignature } from 'util/uploadDriverSignature';
import { signature } from 'models/signaturesModel';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, filter } from 'rxjs';
import { VehicleDeviceRequest } from 'models/vehicleDeviceRequest';
import { CoDriverUnitUpdateRequest } from 'models/coDriverUnitRequest';
import GetAllUnitsDecorators from 'decorators/getAllUnits';
import GetDrivers7daysDecorators from 'decorators/get7daysData';
@Controller('units')
@ApiTags('Units')
export class UnitController extends BaseController {
  constructor(
    private readonly unitService: UnitService,
    private readonly awsService: AwsService,
    @Inject('DRIVER_SERVICE') private readonly driverClient: ClientProxy,
    @Inject('HOS_SERVICE') private readonly hosClient: ClientProxy,
    @Inject('REPORT_SERVICE') private readonly reportService: ClientProxy,
  ) {
    super();
  }

  @EventPattern({ cmd: 'assign_vehicle_to_driver' })
  async tcp_handleVehicleAssignedToDriver(data: VehicleCustom) {
    try {
      const {
        vehicleId,
        driverId,
        coDriverId,
        firstName,
        lastName,
        manualDriverId,
        driverLicense,
        trailerNumber,
        driverUserName,
        driverLicenseState,
        homeTerminalAddress,
        headOffice,
        timeZone,
        headOfficeId,
        homeTerminalAddressId,
        cycleRule,
      }: VehicleCustom = data;
      if (
        // vehicleId &&
        driverId &&
        // Types.ObjectId.isValid(vehicleId) &&
        Types.ObjectId.isValid(driverId)
      ) {
        const data = await this.unitService.updateDriversVehicle(
          driverId,
          vehicleId,
          coDriverId,
          firstName,
          lastName,
          manualDriverId,
          driverLicense,
          trailerNumber,
          driverUserName,
          driverLicenseState,
          homeTerminalAddress,
          headOffice,
          timeZone,
          headOfficeId,
          homeTerminalAddressId,
          cycleRule,
        );
        if (data.ok === 1) {
          const resp: any = {};
          resp.message = data.updatedExisting
            ? 'Vehicle assigned to driver updated successfully'
            : 'Vehicle assigned to driver successfully';
          if (!data.lastErrorObject.updatedExisting) {
            resp.id = data.lastErrorObject.upserted.id;
          }
          return resp;
        }
      } else {
        return new BadRequestException(
          `Vehicle or Driver ID not found or was invalid`,
        );
      }
    } catch (error) {
      return error;
    }
  }
  // @UseInterceptors(MessagePatternResponseInterceptor)
  // @MessagePattern({ cmd: 'update_signature_image' })
  // async tcp_getOfficeById(data: signature): Promise<any | Error> {
  //   try {
  //     const office = await this.unitService.updateUnit(data.driverId, {
  //       imageKey: data.imageKey,
  //       imageName: data.imageName,
  //     });
  //     return office;
  //   } catch (err) {
  //     Logger.error({ message: err.message, stack: err.stack });
  //     return err;
  //   }
  // }
  @MessagePattern({ cmd: 'update_image_URL' })
  async updateImage(data) {
    try {
      const { id, imageUrl } = data;
      const response = await this.unitService.updateImageURL(id, imageUrl);
      if (response) {
        return true;
      }
      return false;
    } catch (exception) {
      return exception;
    }
  }

  @UseInterceptors(MessagePatternResponseInterceptor)
  @MessagePattern({ cmd: 'update_terminal' })
  async tcp_updateTerminal(data: any): Promise<any | Error> {
    try {
      const office = await this.unitService.updateDriverUnit(
        data.driverId,
        data.homeTerminalAddressId,
        data.homeTerminalAddress,
      );
      return office;
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      return err;
    }
  }

  @EventPattern({ cmd: 'assign_device_to_vehicle' })
  async tcp_handleDeviceAssignedToVehicle(requestModel: DeviceVehicleRequest) {
    try {
      const { vehicleId, deviceId, eldId } = requestModel;
      if (
        vehicleId &&
        // deviceId &&
        Types.ObjectId.isValid(vehicleId) &&
        Types.ObjectId.isValid(eldId)
      ) {
        const data = await this.unitService.updateVehiclesDevice(requestModel);
        if (data.ok === 1) {
          const resp: any = {};
          resp.message = data.updatedExisting
            ? 'Vehicle assigned to driver updated successfully'
            : 'Vehicle assigned to driver successfully';
          if (!data.lastErrorObject.updatedExisting) {
            resp.id = data.lastErrorObject.upserted.id;
          }
          return resp;
        } else {
          return new BadRequestException(
            `Vehicle or Device ID not found or was invalid`,
          );
        }
      }
    } catch (error) {
      return error;
    }
  }

  @UseInterceptors(new MessagePatternResponseInterceptor())
  @MessagePattern({ cmd: 'is_vehicle_assigned' })
  async tcp_isVehicleAssigned(data: Record<string, string>): Promise<any> {
    try {
      const { vehicleId, driverId } = data;
      const options: FilterQuery<UnitDocument> = {
        $and: [{ vehicleId }, { driverId: { $ne: null } }],
      };
      if (driverId) {
        options.$and.push({ driverId: { $ne: driverId } });
      }
      const driver = await this.unitService.findOne(options);
      if (!driver) {
        return false;
      }

      return true;
    } catch (exception) {
      return exception;
    }
  }

  @UseInterceptors(new MessagePatternResponseInterceptor())
  @MessagePattern({ cmd: 'get_assigned' })
  async tcp_getVehiclesAssigned(key: string): Promise<any> {
    try {
      let options: FilterQuery<UnitDocument>;
      if (key == 'vehicleId') {
        options = { [key]: { $ne: null }, driverId: { $ne: null } };
      }
      if (key == 'deviceId') {
        options = { [key]: { $ne: null }, vehicleId: { $ne: null } };
      }
      const assign = await this.unitService.find(options, key);
      if (assign && assign.length > 0) {
        return assign.map(function (item) {
          return item[key];
        });
      } else {
        return assign;
      }
    } catch (exception) {
      return exception;
    }
  }

  // get assigned vehicle

  @UseInterceptors(new MessagePatternResponseInterceptor())
  @MessagePattern({ cmd: 'get_assigned_vehicles' })
  async tcp_getAssignedVehicles(key: string): Promise<any> {
    try {
      let options: FilterQuery<UnitDocument>;

      if (key == 'deviceId') {
        options = { [key]: { $ne: null }, vehicleId: { $ne: null } };
      }
      const assign = await this.unitService.findUnitsWithVehicles(options);
      if (assign && assign.length > 0) {
        const returnObject = { vehicleId: '', deviceId: '' };
        return assign.map(function (item) {
          returnObject.vehicleId = item['manualVehicleId'];
          returnObject.deviceId = item['deviceId'];
          return returnObject;
        });
      } else {
        return assign;
      }
    } catch (exception) {
      return exception;
    }
  }
  @UseInterceptors(new MessagePatternResponseInterceptor())
  @MessagePattern({ cmd: 'is_device_assigned' })
  async tcp_isDeviceAssigned(data: Record<string, string>): Promise<any> {
    try {
      const { deviceId, vehicleId } = data;
      const options: FilterQuery<UnitDocument> = {
        $and: [{ deviceId }, { vehicleId: { $ne: null } }],
      };
      if (vehicleId) {
        options.$and.push({ vehicleId: { $ne: vehicleId } });
      }
      const vehicle = await this.unitService.findOne(options);
      if (!vehicle) {
        return false;
      }
      return true;
    } catch (exception) {
      return exception;
    }
  }

  @UseInterceptors(new MessagePatternResponseInterceptor())
  @MessagePattern({ cmd: 'get_assigned_driver_eld_SerialNo' })
  async tcp_getAssignedELDSerialToDriverByDriverId(id: string): Promise<any> {
    try {
      let options: FilterQuery<UnitDocument>;
      options = {
        driverId: new mongoose.Types.ObjectId(id),
        deviceId: { $exists: true, $ne: null },
        vehicleId: { $exists: true, $ne: null },
        isDriverActive: true,
        isActive: true,
      };
      const assign = await this.unitService.findOne(options);
      if (assign && Object.keys(assign).length > 0) {
        const carrier = await this.unitService.getCompany(assign.tenantId);
        if (carrier) {
          assign['_doc']['carrier'] = carrier.name;
          assign['_doc']['usDot'] = carrier.usdot;
        }
        return assign;
      } else {
        throw new BadRequestException(
          'Driver not associate with device serialNo',
        );
      }
    } catch (exception) {
      return exception;
    }
  }
  // @EventPattern({ cmd: 'device_added' })
  // async tcp_addNewDevice(data: Record<string, string>) {
  //   try {
  //     const { deviceId } = data
  //     await this.unitService.addDevice(deviceId)
  //   } catch (error) {
  //     return error
  //   }
  // }
  @EventPattern({ cmd: 'device_added' })
  async tcp_addNewDevice(data: DeviceRequest) {
    try {
      await this.unitService.updateDevice(data);
    } catch (error) {
      return error;
    }
  }

  @EventPattern({ cmd: 'change_driver_status' })
  async tcp_changeDriverStatus(data: Record<string, any>) {
    try {
      const { dataUpdate, driverId } = data;
      if (driverId && Types.ObjectId.isValid(driverId)) {
        const resp = await this.unitService.updateDriverStatus(
          driverId,
          dataUpdate,
        );
        if (resp) {
          return true;
        }
      } else {
        return new BadRequestException(`Driver ID not found or was invalid`);
      }
    } catch (error) {
      return error;
    }
  }

  @EventPattern({ cmd: 'change_vehicle_status' })
  async tcp_changeVehicleStatus(data: Record<string, string>) {
    try {
      const { isActive, vehicleId } = data;
      if (vehicleId && Types.ObjectId.isValid(vehicleId)) {
        const resp = await this.unitService.updateVehicleStatus(
          vehicleId,
          Boolean(isActive),
        );
        if (resp) {
          return true;
        }
      } else {
        return new BadRequestException(`Vehicle ID not found or was invalid`);
      }
    } catch (error) {
      return error;
    }
  }

  @EventPattern({ cmd: 'change_device_status' })
  async tcp_changeDeviceStatus(data: Record<string, string>) {
    try {
      const { isActive, deviceId } = data;
      if (deviceId && Types.ObjectId.isValid(deviceId)) {
        const resp = await this.unitService.updateDeviceStatus(
          deviceId,
          Boolean(isActive),
        );
        if (resp) {
          return true;
        }
      } else {
        return new BadRequestException(`Device ID not found or was invalid`);
      }
    } catch (error) {
      return error;
    }
  }

  @EventPattern({ cmd: 'update_hos_data' })
  async tcp_updateHOSData(data: HOSData) {
    try {
      const { driverId } = data;
      if (driverId && Types.ObjectId.isValid(driverId)) {
        const resp = await this.unitService.updateHOSData(driverId, data);
        if (resp) {
          return true;
        }
      } else {
        return new BadRequestException(`Driver ID not found or was invalid`);
      }
    } catch (error) {
      return error;
    }
  }

  @UseInterceptors(new MessagePatternResponseInterceptor())
  @MessagePattern({ cmd: 'is_unit_active' })
  async tcp_isUnitActive(driverId: string): Promise<any> {
    try {
      const options: FilterQuery<UnitDocument> = {
        $and: [
          { driverId },
          { isDriverActive: true },
          { isVehicleActive: true },
          { isDeviceActive: true },
        ],
      };
      const vehicle = await this.unitService.findOne(options);
      if (!vehicle) {
        return false;
      }
      return true;
    } catch (exception) {
      return exception;
    }
  }

  /**
   * Get unit based on driverId - V2
   * Author Farzan
   */
  // @UseInterceptors(new MessagePatternResponseInterceptor())
  @MessagePattern({ cmd: 'get_unit_by_driverId' })
  async tcp_getUnitByDriverId(driverId: string) {
    try {
      const options: FilterQuery<UnitDocument> = {
        $and: [
          { driverId },
          { isDriverActive: true },
          { isVehicleActive: true },
        ],
      };
      const unit = await this.unitService.findUnit(options);
      // console.log(`vehicel ---------------------- `, unit);

      return unit;
    } catch (exception) {
      return exception;
    }
  }
  @MessagePattern({ cmd: 'get_unit_by_vehicleID' })
  async tcp_getUnitByvehicleIDehicleID(vehicleId: string, tenantId) {
    try {
      const options: FilterQuery<UnitDocument> = {
        $and: [
          { vehicleId },
          // { isDriverActive: true },
          // { isVehicleActive: true },
          // { isDeviceActive: true },
        ],
      };
      const key = 'vehicleId';
      // if (key == 'vehicleId') {
      //   options = { [key]: { $ne: null }, driverId: { $ne: null } };
      // }
      const unit = await this.unitService.findUnits(options);
      // console.log(`vehicel ---------------------- `, unit);

      return unit;
    } catch (exception) {
      return exception;
    }
  }
  @MessagePattern({ cmd: 'get_unit_by_officeID' })
  async tcp_getUnitByofficeID(officeID: string) {
    try {
      // }
      const unit = await this.unitService.findUnitsWithOffice(officeID);
      // console.log(`vehicel ---------------------- `, unit);

      return unit;
    } catch (exception) {
      return exception;
    }
  }
  @MessagePattern({ cmd: 'get_all_current_statuses' })
  async getAllCurrentStatuses(tenantId: any) {
    try {
      const options: FilterQuery<UnitDocument> = {};

      const status = {
        onDuty: 0,
        offDuty: 0,
        sleeperBerth: 0,
        driving: 0,
        pc: 0,
        ym: 0,
      };
      options.$and = [];
      options.$and.push(
        { meta: { $exists: true, $ne: null } },

        { tenantId: tenantId },
      );
      const query = this.unitService.findData(options);
      const queryResponse = await query.exec();
      for (const user of queryResponse) {
        if (user['_doc'].meta) {
          const lastActivity = user['_doc']['meta']['lastActivity'];

          if (lastActivity) {
            if (
              lastActivity.currentEventCode == '1' &&
              lastActivity.currentEventType == '1'
            ) {
              status.offDuty = status.offDuty + 1;
            } else if (
              lastActivity.currentEventCode == '2' &&
              lastActivity.currentEventType == '1'
            ) {
              status.sleeperBerth = status.sleeperBerth + 1;
            } else if (
              lastActivity.currentEventCode == '3' &&
              lastActivity.currentEventType == '1'
            ) {
              status.driving = status.driving + 1;
            } else if (
              lastActivity.currentEventCode == '4' &&
              lastActivity.currentEventType == '1'
            ) {
              status.onDuty = status.onDuty + 1;
            } else if (
              lastActivity.currentEventCode == '1' &&
              lastActivity.currentEventType == '3'
            ) {
              status.pc = status.pc + 1;
            } else if (
              lastActivity.currentEventCode == '3' &&
              lastActivity.currentEventType == '3'
            ) {
              status.ym = status.ym + 1;
            }
          }
        }
        // driverIDS.push(user['_doc']['driverId']);
      }

      return status;
    } catch (exception) {
      return exception;
    }
  }

  // get updated ststuses
  @MessagePattern({ cmd: 'update_unit_by_officeIDs' })
  async updateUnitByOfficeID(data: any) {
    try {
      const { filter, updateOperation } = data;
      const unit = await this.unitService.updateUnitsWithOffice(
        filter,
        updateOperation,
      );
      // console.log(`vehicel ---------------------- `, unit);

      return unit;
    } catch (exception) {
      return exception;
    }
  }
  @MessagePattern({ cmd: 'get_company' })
  async tcp_getcompany(tenantId: string) {
    try {
      const carrier = await this.unitService.getCompany(tenantId);
      return carrier;
    } catch (exception) {
      return exception;
    }
  }

  // log listing endpoint
  @GetAllUnitsDecorators()
  async getAllDrivers(
    @Query(new ListingParamsValidationPipe()) queryParams,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const options: FilterQuery<UnitDocument> = {};
      const { search, orderBy, orderType, pageNo, limit, date } = queryParams;
      let isActive = queryParams?.isActive;
      const { tenantId: id } = request.user ?? ({ tenantId: undefined } as any);
      const arr = [];
      arr.push(isActive);
      if (arr.includes('true')) {
        isActive = true;
      } else {
        isActive = false;
      }

      if (search) {
        options.$or = [];
        searchableAttributes.forEach((attribute) => {
          options.$or.push({ [attribute]: new RegExp(search, 'i') });
        });
        if (arr[0]) {
          options['$and'] = [];
          isActiveinActive.forEach((attribute) => {
            options.$and.push({ [attribute]: isActive });
          });
        }
      } else {
        // options.$or.push({'isActive':isActive})
        if (arr[0]) {
          options.$or = [];
          isActiveinActive.forEach((attribute) => {
            options.$or.push({ [attribute]: isActive });
          });
        }
      }

      options.$and = [];
      options.$and.push(
        // { deviceId: { $exists: true, $ne: null } },
        { driverId: { $exists: true, $ne: null } },
        // { vehicleId: { $exists: true, $ne: null } },
        { tenantId: id },
      );

      Logger.log(
        `Calling find method of Unit service with search options to get query.`,
      );
      const query = this.unitService.findData(options);

      Logger.log(`Adding sort options to query.`);
      if (orderBy && sortableAttributes.includes(orderBy)) {
        query.collation({ locale: 'en' }).sort({ [orderBy]: orderType ?? 1 });
      } else {
        query.sort({ updatedAt: -1 });
      }

      Logger.log(
        `Calling count method of unit service with search options to get total count of records.`,
      );
      const total = await this.unitService.count(options);

      Logger.log(
        `Executing query with pagination. Skipping: ${
          ((pageNo ?? 1) - 1) * (limit ?? 10)
        }, Limit: ${limit ?? 10}`,
      );
      if (!limit || !isNaN(limit)) {
        query.skip(((pageNo ?? 1) - 1) * (limit ?? 10)).limit(limit ?? 10);
      }
      const queryResponse = await query.exec();
      console.log(
        `Resuts ----------------------------------------- `,
        queryResponse,
      );

      const unitList: UnitResponse[] = [];
      const driverIDS = [];
      for (const user of queryResponse) {
        unitList.push(new UnitResponse(user));
        driverIDS.push(user['_doc']['driverId']);
      }
      if (date) {
        console.log('IN IF when date present');
        const resu = await firstValueFrom<MessagePatternResponseType>(
          this.hosClient.send(
            { cmd: 'get_recordTable' },
            { driverID: driverIDS, date: date },
          ),
        );

        console.log('got record table');
        for (let i = 0; i < resu.data.length; i++) {
          const dataObject = resu.data[i];

          // Find the corresponding unit for the current dataObject's driverId
          const matchingUnit = unitList.find(
            (unit) => unit.driverId == dataObject.driverId,
          );

          if (matchingUnit) {
            // date:any,driverId:any,tenantId,companyTimeZone
            //   const logform = await firstValueFrom<MessagePatternResponseType>(
            //     this.reportService.send(
            //       { cmd: 'get_logform' },
            //       {
            //         date: date,
            //         driverId: matchingUnit.driverId,
            //         tenantId: matchingUnit.tenantId,
            //         companyTimeZone:
            //           matchingUnit.homeTerminalTimeZone['_doc']['tzCode'],
            //       },
            //     ),
            //   );
            matchingUnit.violations = dataObject.violations;
            matchingUnit.ptiType = dataObject.isPti;
            matchingUnit.meta['clockData'] = dataObject?.clock;
            //   // Do something with the matching unit and dataObject
            //   matchingUnit.violations = dataObject.violations;
            //   matchingUnit.ptiType = dataObject.isPti;
            //   console.log('\n\n' + ('shippingDocument' in logform));
            //   console.log('\n\n' + 'sign' in logform);
            //   // Check for shippingDocument key
            //   matchingUnit.violations.push({
            //     isShippingID: 'shippingDocument' in logform?.data,
            //   });
            //   // Check for sign key
            //   matchingUnit.violations.push({
            //     isSignature: 'sign' in logform?.data,
            //   });
            //   console.log(`Driver ${matchingUnit} has data: `, dataObject);
          } else {
            //   // Handle the case where no matching unit is found
            console.log(
              `No matching unit found for driverId ${dataObject.driverId}`,
            );
          }
        }
      }

      return response.status(HttpStatus.OK).send({
        data: unitList,
        total,
        pageNo: pageNo ?? 1,
        last_page: Math.ceil(
          total /
            (limit && limit.toString().toLowerCase() === 'all'
              ? total
              : limit ?? 10),
        ),
        message: 'Data found.',
      });
    } catch (error) {
      Logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }

  @GetDrivers7daysDecorators()
  async getDrivers7days(
    @Query(new ListingParamsValidationPipe()) queryParams,
    @Query('driverId') driverId: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const options: FilterQuery<UnitDocument> = {};

      const { tenantId: id } = request.user ?? ({ tenantId: undefined } as any);
      const { user } = request;
      options.$and = [];
      options.$and.push(
        { driverId: driverId },

        { tenantId: id },
      );

      Logger.log(
        `Calling find method of Unit service with search options to get query.`,
      );
      const unit = await this.unitService.getOneUnit(options);

      const unitList = [];

      let currentDate = moment().tz(unit.homeTerminalTimeZone.tzCode);
      const startOfWeek = currentDate.clone().startOf('isoWeek');
      const previous7Days = [];
      // Populate the array with the dates of the previous 7 days
      for (let i = 1; i <= 7; i++) {
        previous7Days.push(
          currentDate.clone().subtract(i, 'days').format('YYYY-MM-DD'),
        );
      }
      let tableData = {};
      let recordData;
      for (const date of previous7Days) {
        recordData = await firstValueFrom<MessagePatternResponseType>(
          this.hosClient.send(
            { cmd: 'get_recordTable' },
            { driverID: driverId, date: date },
          ),
        );

        if (recordData.data[0]) {
          const dataObject = recordData.data[0];
          tableData = {};
          // Find the corresponding unit for the current dataObject's driverId
          tableData['violations'] = dataObject.violations;
          tableData['ptiType'] = dataObject.isPti;
          tableData['clocks'] = dataObject?.clock;
          tableData['date'] = dataObject?.date;
          tableData['vehicleId'] = unit.manualVehicleId;
          tableData['driverId'] = unit.driverId;
          let lastActicity = unit.meta['lastActivity'];
          tableData['status'] = {
            currentEventCode: lastActicity.currentEventCode,
            currentEventType: lastActicity.currentEventType,
          };
          tableData['location'] = lastActicity.address;
        }
        unitList.push(tableData);
      }

      return response.status(HttpStatus.OK).send({
        data: unitList,
        message: 'Data found.',
      });
    } catch (error) {
      Logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }
  @GetDecorators()
  async getDrivers(
    @Query(new ListingParamsValidationPipe()) queryParams,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const options: FilterQuery<UnitDocument> = {};
      const { search, orderBy, orderType, pageNo, limit, date } = queryParams;
      let isActive = queryParams?.isActive;
      const { tenantId: id } = request.user ?? ({ tenantId: undefined } as any);
      const arr = [];
      arr.push(isActive);
      if (arr.includes('true')) {
        isActive = true;
      } else {
        isActive = false;
      }
      // let isActive = false
      // if(isActive === 'false'){}

      if (search) {
        options.$or = [];
        searchableAttributes.forEach((attribute) => {
          options.$or.push({ [attribute]: new RegExp(search, 'i') });
        });
        if (arr[0]) {
          options['$and'] = [];
          isActiveinActive.forEach((attribute) => {
            options.$and.push({ [attribute]: isActive });
          });
        }
      } else {
        // options.$or.push({'isActive':isActive})
        if (arr[0]) {
          options.$or = [];
          isActiveinActive.forEach((attribute) => {
            options.$or.push({ [attribute]: isActive });
          });
        }
      }

      options.$and = [];
      options.$and.push(
        // { deviceId: { $exists: true, $ne: null } },
        { driverId: { $exists: true, $ne: null } },
        { vehicleId: { $exists: true, $ne: null } },
        { tenantId: id },
      );

      Logger.log(
        `Calling find method of Unit service with search options to get query.`,
      );
      const query = this.unitService.findData(options);

      Logger.log(`Adding sort options to query.`);
      if (orderBy && sortableAttributes.includes(orderBy)) {
        query.collation({ locale: 'en' }).sort({ [orderBy]: orderType ?? 1 });
      } else {
        query.sort({ updatedAt: -1 });
      }

      Logger.log(
        `Calling count method of unit service with search options to get total count of records.`,
      );
      const total = await this.unitService.count(options);

      Logger.log(
        `Executing query with pagination. Skipping: ${
          ((pageNo ?? 1) - 1) * (limit ?? 10)
        }, Limit: ${limit ?? 10}`,
      );
      if (!limit || !isNaN(limit)) {
        query.skip(((pageNo ?? 1) - 1) * (limit ?? 10)).limit(limit ?? 10);
      }
      const queryResponse = await query.exec();
      console.log(
        `Resuts ----------------------------------------- `,
        queryResponse,
      );

      const unitList: UnitResponse[] = [];
      const driverIDS = [];
      for (const user of queryResponse) {
        unitList.push(new UnitResponse(user));
        driverIDS.push(user['_doc']['driverId']);
      }
      if (date) {
        console.log('IN IF when date present');
        const resu = await firstValueFrom<MessagePatternResponseType>(
          this.hosClient.send(
            { cmd: 'get_recordTable' },
            { driverID: driverIDS, date: date },
          ),
        );

        console.log('got record table');
        for (let i = 0; i < resu.data.length; i++) {
          const dataObject = resu.data[i];

          // Find the corresponding unit for the current dataObject's driverId
          const matchingUnit = unitList.find(
            (unit) => unit.driverId == dataObject.driverId,
          );

          // if (matchingUnit) {
          //   // date:any,driverId:any,tenantId,companyTimeZone
          //   //   const logform = await firstValueFrom<MessagePatternResponseType>(
          //   //     this.reportService.send(
          //   //       { cmd: 'get_logform' },
          //   //       {
          //   //         date: date,
          //   //         driverId: matchingUnit.driverId,
          //   //         tenantId: matchingUnit.tenantId,
          //   //         companyTimeZone:
          //   //           matchingUnit.homeTerminalTimeZone['_doc']['tzCode'],
          //   //       },
          //   //     ),
          //   //   );
          //   //   // Do something with the matching unit and dataObject
          //   matchingUnit.violations = dataObject.violations;
          //   matchingUnit.ptiType = dataObject.isPti;
          //   matchingUnit.meta['clockData'] = dataObject?.clock;
          //   //   console.log('\n\n' + ('shippingDocument' in logform));
          //   //   console.log('\n\n' + 'sign' in logform);
          //   //   // Check for shippingDocument key
          //   //   matchingUnit.violations.push({
          //   //     isShippingID: 'shippingDocument' in logform?.data,
          //   //   });
          //   //   // Check for sign key
          //   //   matchingUnit.violations.push({
          //   //     isSignature: 'sign' in logform?.data,
          //   //   });
          //   //   console.log(`Driver ${matchingUnit} has data: `, dataObject);
          // } else {
          //   //   // Handle the case where no matching unit is found
          //   console.log(
          //     `No matching unit found for driverId ${dataObject.driverId}`,
          //   );
          // }
        }
      }

      return response.status(HttpStatus.OK).send({
        data: unitList,
        total,
        pageNo: pageNo ?? 1,
        last_page: Math.ceil(
          total /
            (limit && limit.toString().toLowerCase() === 'all'
              ? total
              : limit ?? 10),
        ),
        message: 'Data found.',
      });
    } catch (error) {
      Logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }
  // get unit for listing

  @GetLogsDecorators()
  async getLogDrivers(
    @Query(new ListingParamsValidationPipe()) queryParams,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const options: FilterQuery<UnitDocument> = {};
      const { search, orderBy, orderType, pageNo, limit, date } = queryParams;
      let isActive = queryParams?.isActive;
      const { tenantId: id } = request.user ?? ({ tenantId: undefined } as any);
      const arr = [];
      arr.push(isActive);
      if (arr.includes('true')) {
        isActive = true;
      } else {
        isActive = false;
      }
      // let isActive = false
      // if(isActive === 'false'){}

      if (search) {
        options.$or = [];
        searchableAttributes.forEach((attribute) => {
          options.$or.push({ [attribute]: new RegExp(search, 'i') });
        });
        if (arr[0]) {
          options['$and'] = [];
          isActiveinActive.forEach((attribute) => {
            options.$and.push({ [attribute]: isActive });
          });
        }
      } else {
        // options.$or.push({'isActive':isActive})
        if (arr[0]) {
          options.$or = [];
          isActiveinActive.forEach((attribute) => {
            options.$or.push({ [attribute]: isActive });
          });
        }
      }

      options.$and = [];
      options.$and.push(
        // { deviceId: { $exists: true, $ne: null } },
        { driverId: { $exists: true, $ne: null } },
        { vehicleId: { $exists: true, $ne: null } },
        { tenantId: id },
      );

      Logger.log(
        `Calling find method of Unit service with search options to get query.`,
      );
      const query = this.unitService.findData(options);

      Logger.log(`Adding sort options to query.`);
      if (orderBy && sortableAttributes.includes(orderBy)) {
        query.collation({ locale: 'en' }).sort({ [orderBy]: orderType ?? 1 });
      } else {
        query.sort({ updatedAt: -1 });
      }

      Logger.log(
        `Calling count method of unit service with search options to get total count of records.`,
      );
      const total = await this.unitService.count(options);

      Logger.log(
        `Executing query with pagination. Skipping: ${
          ((pageNo ?? 1) - 1) * (limit ?? 10)
        }, Limit: ${limit ?? 10}`,
      );
      if (!limit || !isNaN(limit)) {
        query.skip(((pageNo ?? 1) - 1) * (limit ?? 10)).limit(limit ?? 10);
      }
      const queryResponse = await query.exec();
      console.log(
        `Resuts ----------------------------------------- `,
        queryResponse,
      );

      const unitList: UnitResponse[] = [];
      const driverIDS = [];
      for (const user of queryResponse) {
        unitList.push(new UnitResponse(user));
        driverIDS.push(user['_doc']['driverId']);
      }
      if (date) {
        console.log('IN IF when date present');
        const resu = await firstValueFrom<MessagePatternResponseType>(
          this.hosClient.send(
            { cmd: 'get_recordTable' },
            { driverID: driverIDS, date: date },
          ),
        );

        console.log('got record table');
        for (let i = 0; i < resu.data.length; i++) {
          const dataObject = resu.data[i];

          // Find the corresponding unit for the current dataObject's driverId
          const matchingUnit = unitList.find(
            (unit) => unit.driverId == dataObject.driverId,
          );

          if (matchingUnit) {
          } else {
            console.log(
              `No matching unit found for driverId ${dataObject.driverId}`,
            );
          }
        }
      }

      return response.status(HttpStatus.OK).send({
        data: unitList,
        total,
        pageNo: pageNo ?? 1,
        last_page: Math.ceil(
          total /
            (limit && limit.toString().toLowerCase() === 'all'
              ? total
              : limit ?? 10),
        ),
        message: 'Data found.',
      });
    } catch (error) {
      Logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }

  // get listing of all units statuses
  // for the traking
  @allcurrentStatusesDecorators()
  async allCurrentStatuses(
    @Query(new ListingParamsValidationPipe()) queryParams,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const options: FilterQuery<UnitDocument> = {};
      const { tenantId: id } = request.user ?? ({ tenantId: undefined } as any);
      const status = {
        onDuty: 0,
        offDuty: 0,
        sleeperBerth: 0,
        driving: 0,
        pc: 0,
        ym: 0,
      };
      options.$and = [];
      options.$and.push(
        { meta: { $exists: true, $ne: null } },

        { tenantId: id },
      );
      const query = this.unitService.findData(options);
      const queryResponse = await query.exec();
      for (const user of queryResponse) {
        if (user['_doc'].meta) {
          const lastActivity = user['_doc']['meta']['lastActivity'];

          if (lastActivity) {
            if (
              lastActivity.currentEventCode == '1' &&
              lastActivity.currentEventType == '1'
            ) {
              status.offDuty = status.offDuty + 1;
            } else if (
              lastActivity.currentEventCode == '2' &&
              lastActivity.currentEventType == '1'
            ) {
              status.sleeperBerth = status.sleeperBerth + 1;
            } else if (
              lastActivity.currentEventCode == '3' &&
              lastActivity.currentEventType == '1'
            ) {
              status.driving = status.driving + 1;
            } else if (
              lastActivity.currentEventCode == '4' &&
              lastActivity.currentEventType == '1'
            ) {
              status.onDuty = status.onDuty + 1;
            } else if (
              lastActivity.currentEventCode == '1' &&
              lastActivity.currentEventType == '3'
            ) {
              status.pc = status.pc + 1;
            } else if (
              lastActivity.currentEventCode == '3' &&
              lastActivity.currentEventType == '3'
            ) {
              status.ym = status.ym + 1;
            }
          }
        }
        // driverIDS.push(user['_doc']['driverId']);
      }

      return response.status(HttpStatus.OK).send({
        data: status,
        message: 'Data found.',
      });
    } catch (error) {
      Logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }
  // get listing of all units
  // for the traking
  @GetTrackingDecorators()
  async getTrackingListing(
    @Query(new ListingParamsValidationPipe()) queryParams,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const options: FilterQuery<UnitDocument> = {};
      const { search, orderBy, orderType, pageNo, limit, date } = queryParams;
      let isActive = queryParams?.isActive;
      const { tenantId: id } = request.user ?? ({ tenantId: undefined } as any);
      const arr = [];
      arr.push(isActive);
      if (arr.includes('true')) {
        isActive = true;
      } else {
        isActive = false;
      }
      // let isActive = false
      // if(isActive === 'false'){}

      if (search) {
        options.$or = [];
        searchableAttributes.forEach((attribute) => {
          options.$or.push({ [attribute]: new RegExp(search, 'i') });
        });
        if (arr[0]) {
          options['$and'] = [];
          isActiveinActive.forEach((attribute) => {
            options.$and.push({ [attribute]: isActive });
          });
        }
      } else {
        // options.$or.push({'isActive':isActive})
        if (arr[0]) {
          options.$or = [];
          isActiveinActive.forEach((attribute) => {
            options.$or.push({ [attribute]: isActive });
          });
        }
      }

      options.$and = [];
      options.$and.push(
        { meta: { $exists: true, $ne: null } },

        { tenantId: id },
      );

      Logger.log(
        `Calling find method of Unit service with search options to get query.`,
      );
      const query = this.unitService.findData(options);

      Logger.log(`Adding sort options to query.`);
      if (orderBy && sortableAttributes.includes(orderBy)) {
        query.collation({ locale: 'en' }).sort({ [orderBy]: orderType ?? 1 });
      } else {
        query.sort({ updatedAt: -1 });
      }

      Logger.log(
        `Calling count method of unit service with search options to get total count of records.`,
      );
      const total = await this.unitService.count(options);

      Logger.log(
        `Executing query with pagination. Skipping: ${
          ((pageNo ?? 1) - 1) * (limit ?? 10)
        }, Limit: ${limit ?? 10}`,
      );
      if (!limit || !isNaN(limit)) {
        query.skip(((pageNo ?? 1) - 1) * (limit ?? 10)).limit(limit ?? 10);
      }
      const queryResponse = await query.exec();
      console.log(
        `Resuts ----------------------------------------- `,
        queryResponse,
      );

      const unitList: TrackingListing[] = [];
      const driverIDS = [];
      let lastActivity;
      for (const user of queryResponse) {
        if (user['_doc'].meta) {
          const lastActivity = user['_doc']['meta']['lastActivity'];

          if (user['_doc']['meta']['lastActivity']) {
            unitList.push(new TrackingListing(user));
          }
        }
        // driverIDS.push(user['_doc']['driverId']);
      }

      return response.status(HttpStatus.OK).send({
        data: unitList,
        total,
        pageNo: pageNo ?? 1,
        last_page: Math.ceil(
          total /
            (limit && limit.toString().toLowerCase() === 'all'
              ? total
              : limit ?? 10),
        ),
        message: 'Data found.',
      });
    } catch (error) {
      Logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }
  // @UpdateByIdDecoratorsMobile()
  // @UseInterceptors(FileInterceptor('driverSignature'))
  // async updateMobile(
  //   @UploadedFile() driverSignature: Express.Multer.File,
  //   @Body() editRequestData: UnitEditRequest,
  //   @Req() request: Request,
  //   @Res() response: Response,
  // ) {
  //   const { id, tenantId } = request.user ?? ({ tenantId: undefined } as any);
  //   let requestUnit = await uploadDriverSignature(
  //     id,
  //     tenantId,
  //     this.awsService,
  //     editRequestData,
  //     driverSignature,
  //   );
  //   // let Unit = await UnitUpdateByDriverId(id, requestUnit, this.unitService);
  //   if (Unit && Object.keys(Unit).length > 0) {
  //     let list = new UnitResponse(Unit);
  //     return response.status(HttpStatus.OK).send({
  //       message: 'Log form has been updated',
  //     });
  //   }
  //   try {
  //   } catch (error) {
  //     Logger.error({ message: error.message, stack: error.stack });
  //     throw error;
  //   }
  // }

  // @UpdateByIdDecorators()
  // async update(
  //   @Param('driverId', MongoIdValidationPipe) driverId: string,
  //   @Body() editRequestData: UnitEditRequest,
  //   @Res() response: Response,
  //   @Req() request: Request,
  // ) {
  //   const { tenantId } = request.user ?? ({ tenantId: undefined } as any);
  //   let Unit = await UnitUpdateByDriverId(
  //     driverId,
  //     editRequestData,
  //     this.unitService,
  //   );
  //   if (Unit && Object.keys(Unit).length > 0) {
  //     let list = new UnitResponse(Unit);
  //     return response.status(HttpStatus.OK).send({
  //       message: 'Log form has been updated',
  //       data: list,
  //     });
  //   }
  //   try {
  //   } catch (error) {
  //     Logger.error({ message: error.message, stack: error.stack });
  //     throw error;
  //   }
  // }

  // @GetByIdDecoratorsMobile()
  // async getUnitByDriverIdMobile(
  //   @Query('date') date: string = moment().utc().format('YYYY-MM-DD'),
  //   @Res() res: Response,
  //   @Req() request: Request,
  // ) {
  //   try {
  //     const { id, tenantId } = request.user ?? ({ tenantId: undefined } as any);
  //     Logger.log(`getUnitById was called with params: ${id}`);
  //     const data = await this.unitService.getUnitById(id);
  //     if (data && Object.keys(data).length > 0) {
  //       let unitData = await getUnitByDriverId(
  //         id,
  //         data['_doc'],
  //         date,
  //         this.unitService,
  //         this.awsService,
  //         tenantId,
  //       );
  //       return res.status(HttpStatus.OK).send({
  //         message: 'Unit Found',
  //         data: unitData,
  //       });
  //     } else {
  //       return res.status(HttpStatus.OK).send({
  //         message: 'Unit not Found',
  //         data: {},
  //       });
  //     }
  //   } catch (err) {
  //     Logger.error({ message: err.message, stack: err.stack });
  //     throw err;
  //   }
  // }

  @GetByIdDecorators()
  async getUnitByDriverId(
    @Param('driverId', MongoIdValidationPipe) driverId: string,
    @Query('date') date: string = moment().utc().format('YYYY-MM-DD'),
    @Res() res: Response,
    @Req() request: Request,
  ) {
    try {
      const { id, tenantId, companyTimeZone } =
        request.user ?? ({ tenantId: undefined } as any);
      Logger.log(`getUnitById was called with params: ${driverId}`);
      const data = await this.unitService.getUnitById(driverId);
      if (data && Object.keys(data).length > 0) {
        // let unitData = await getUnitByDriverId(
        //   driverId,
        //   data['_doc'],
        //   date,
        //   this.unitService,
        //   this.awsService,
        //   tenantId,
        // );
        return res.status(HttpStatus.OK).send({
          message: 'Unit Found',
          data: data,
        });
      } else {
        return res.status(HttpStatus.OK).send({
          message: 'Unit not Found',
          data: {},
        });
      }
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  }

  @UseInterceptors(new MessagePatternResponseInterceptor())
  @MessagePattern({ cmd: 'get_units' })
  async tcp_getUnits(vin): Promise<any> {
    console.log(`IM in units controller`);
    try {
      const ids = [];
      const units = await this.unitService.getUnitsByVin(vin);
      if (units.data.length < 1) {
        return {
          statusCode: 200,
          message: 'No units available against this Vehicle vim!',
          data: [],
        };
      }

      for (let i = 0; i < units.data.length; i++) {
        ids.push(units.data[i].driverId);
      }

      if (ids.length > 0) {
        const deviceTokens = await firstValueFrom(
          this.driverClient.send({ cmd: 'get_drivers_by_ids' }, ids),
        );
        console.log('units check ----- ', deviceTokens);
        if (deviceTokens.isError) {
          Logger.log(`Coneection to driver failed!`);
          throw new NotFoundException(`Coneection to driver failed!`);
        }

        return deviceTokens.data;
      }
    } catch (exception) {
      return exception;
    }
  }

  /**
   * V2
   * Author: Farzan
   */
  @MessagePattern({ cmd: 'assign_meta_to_units' })
  async assignMeta(obj) {
    try {
      const response = await this.unitService.assignMeta(obj.meta, obj.user);
      if (response) {
        return true;
      }
      return false;
    } catch (exception) {
      return exception;
    }
  }

  @EventPattern({ cmd: 'update_office_details' })
  async tcp_updateOfficeDetails(object) {
    try {
      const response = await this.unitService.updateOfficeDetials(object);
      return response;
    } catch (error) {
      return error;
    }
  }

  @EventPattern({ cmd: 'vehicle_added_to_unit' })
  async tcp_addNewVehicle(data: DeviceVehicleRequest) {
    try {
      await this.unitService.updateUnitVehicle(data);
    } catch (error) {
      return error;
    }
  }

  @EventPattern({ cmd: 'device_add_to_vehicle_unit' })
  async tcp_addNewDeviceToVehicleUnit(data: VehicleDeviceRequest) {
    try {
      await this.unitService.updateDeviceToUnit(data);
    } catch (error) {
      return error;
    }
  }

  @EventPattern({ cmd: 'assign_driver_to_unit' })
  async tcp_addNewDriverToUnit(data: DriverVehicleToUnitRequest) {
    try {
      await this.unitService.updateUnitByAddDriver(data);
    } catch (error) {
      return error;
    }
  }

  @EventPattern({ cmd: 'co_driver_update_unit' })
  async tcp_coDriverUpdateUnit(data: CoDriverUnitUpdateRequest) {
    try {
      const res = await this.unitService.updateCoDriverUnit(data);
    } catch (error) {
      return error;
    }
  }
}
