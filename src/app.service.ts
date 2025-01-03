import { DeviceVehicleRequest } from 'models/deviceVehicle';
import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import {
  BaseService,
  mapMessagePatternResponseToException,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import {
  FilterQuery,
  Model,
  QueryOptions,
  ProjectionType,
  Schema,
} from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { getLocationDescription } from './util/formatedLocation';

import { InjectModel } from '@nestjs/mongoose';
import UnitDocument from 'mongoDb/document/document';
import mongoose from 'mongoose';
import { DeviceRequest } from 'models/deviceRequestModel';
import { HOSData } from 'models/HOSData';
import {
  DriverVehicleToUnitRequest,
  TimeZone,
} from 'models/driverVehicleRequest';
import { async, firstValueFrom } from 'rxjs';
import { UnitEditRequest } from 'models/editUnitRequestModel';
import { UnitDriver } from 'models/updateUnit.model';
import moment from 'moment';
import { VehicleDeviceRequest } from 'models/vehicleDeviceRequest';
import { CoDriverUnitUpdateRequest } from 'models/coDriverUnitRequest';
@Injectable()
export class UnitService extends BaseService<UnitDocument> {
  private readonly logger = new Logger('Units Service');

  constructor(
    @Inject('HOS_SERVICE') private readonly client: ClientProxy,
    @Inject('DRIVER_SERVICE') private readonly driverClient: ClientProxy,
    @Inject('VEHICLE_SERVICE') private readonly vehicleClient: ClientProxy,
    @Inject('OFFICE_SERVICE') private readonly officeClient: ClientProxy,
    @Inject('COMPANY_SERVICE') private readonly companyClient: ClientProxy,
    @InjectModel('Unit') private readonly unitModel: Model<UnitDocument>, // @Inject('VEHICLE_SERVICE') private readonly vehicleClient: ClientProxy, // @Inject('DRIVER_SERVICE') private readonly driverClient: ClientProxy,
  ) {
    super();
  }

  findOne = async (
    options: FilterQuery<UnitDocument>,
  ): Promise<UnitDocument> => {
    try {
      options.isDeleted = false;
      return await this.unitModel.findOne(options);
    } catch (err) {
      this.logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };

  /**
   * Find UNit on driverId - V2
   * Author Farzan
   */
  findUnit = async (options: FilterQuery<UnitDocument>) => {
    try {
      options.isDeleted = false;
      const unit = await this.unitModel.findOne(options);
      if (!unit) {
        return {
          statusCode: 200,
          message: 'No unit found!',
          data: {},
        };
      }
      return {
        statusCode: 200,
        message: 'Unit fetched successfully!',
        data: unit,
      };
    } catch (err) {
      this.logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };

  find = async (
    options: FilterQuery<UnitDocument>,
    key: string,
  ): Promise<string[]> => {
    try {
      options.isDeleted = false;
      return await this.unitModel.find(options, { [key]: 1, _id: 0 });
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };
  findUnits = async (options: FilterQuery<UnitDocument>): Promise<string[]> => {
    try {
      // options.isDeleted = false;
      return await this.unitModel.find(options);
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      // const expectionOccure = {'err':err,'data':''}
      return [];
    }
  };
  findUnitsWithVehicles = async (
    options: FilterQuery<UnitDocument>,
  ): Promise<string[]> => {
    try {
      // options.isDeleted = false;
      return await this.unitModel.find(options).lean();
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      // const expectionOccure = {'err':err,'data':''}
      return [];
    }
  };
  findUnitsWithOffice = async (officeID: any): Promise<string[]> => {
    try {
      // options.isDeleted = false;
      return await this.unitModel.find({ homeTerminalAddressId: officeID });
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      // const expectionOccure = {'err':err,'data':''}
      return [];
    }
  };
  updateUnitsWithOffice = async (filter: any, updateOperation: any) => {
    try {
      // options.isDeleted = false;
      const updated = await this.unitModel.updateMany(filter, updateOperation);
      return updated;
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      // const expectionOccure = {'err':err,'data':''}
      return [];
    }
  };
  updateDriversVehicle = async (
    driverId: string,
    vehicleId: string,
    coDriverId: string = null,
    firstName: string,
    lastName: string,
    manualDriverId: string,
    driverLicense: string,
    trailerNumber: string,
    driverUserName: string,
    driverLicenseState: string,
    homeTerminalAddress: string,
    headOffice: string,
    homeTerminalTimeZone: string | TimeZone,
    headOfficeId: string,
    homeTerminalAddressId: string,
    cycleRule: string,
    upsert: boolean = true,
  ): Promise<any> => {
    try {
      const oldAssignment = await this.unitModel.findOneAndUpdate(
        { driverId },
        {
          driverId: null,
          coDriverId: null,
          firstName: null,
          lastName: null,
          manualDriverId: null,
          driverLicense: null,
          trailerNumber: null,
          driverUserName: null,
          driverLicenseState: null,
          homeTerminalAddress: null,
          headOffice: null,
          homeTerminalTimeZone: null,
          cycleRule: null,
          driverFirstName: null,
          driverLastName: null,
        },
      );

      return await this.unitModel.findOneAndUpdate(
        {
          vehicleId,
        },
        {
          driverId: driverId,
          coDriverId: coDriverId,
          driverFirstName: firstName,
          driverLastName: lastName,
          driverFullName: `${firstName} ${lastName}`,
          manualDriverId: manualDriverId,
          driverLicense: driverLicense,
          trailerNumber: trailerNumber,
          driverUserName: driverUserName,
          driverLicenseState: driverLicenseState,
          homeTerminalAddress: homeTerminalAddress,
          headOffice: headOffice,
          homeTerminalTimeZone: homeTerminalTimeZone,
          headOfficeId: headOfficeId,
          homeTerminalAddressId: homeTerminalAddressId,
          cycleRule: cycleRule,
        },
        // {
        //   new: true,
        //   upsert,
        //   rawResult: true,
        // },
      );
      // return newVehicleAssigned;
    } catch (error) {
      this.logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  };

  findData = (options: FilterQuery<UnitDocument>) => {
    try {
      console.log(`Options check --------------------- `, options);

      const query = this.unitModel.find(options);
      query.and([{ isDeleted: false }]);
      return query;
    } catch (err) {
      this.logger.log('Error Logged in find method of User Service');
      this.logger.error({ message: err.message, stack: err.stack });
      this.logger.log({ options });
      throw err;
    }
  };

  updateTerminal = async (
    driverId: string,
    option = {},
    upsert: boolean = true,
  ): Promise<any> => {
    const updated = await this.unitModel.findOneAndUpdate(
      {
        driverId: driverId,
      },
      option,
      {
        new: true,
        upsert,
        rawResult: true,
      },
    );
  };

  updateVehicle = async (
    driverId: string,
    option: DeviceVehicleRequest,
    upsert: boolean = true,
  ) => {
    try {
      return await this.unitModel.findOneAndUpdate(
        {
          driverId,
        },
        option,
        {
          new: true,
          upsert,
          rawResult: true,
        },
      );
    } catch (error) {
      this.logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  };

  updateVehiclesDevice = async (
    data: DeviceVehicleRequest,
    upsert: boolean = true,
  ): Promise<any> => {
    try {
      const {
        isActive,
        eldNo,
        vendor,
        serialNo,
        eldId,
        vehicleId,
        deviceId,
        licensePlateNo,
        make,
        manualVehicleId,
        vehicleVinNo,
      } = data;

      // const oldAssignment = await this.unitModel.findOneAndUpdate(
      //   { vehicleId },
      //   {
      //     vehicleId: null,
      //     vehicleLicensePlateNo: null,
      //     vehicleMake: null,
      //     manualVehicleId: null,
      //     vehicleVinNo: null,
      //   },
      // );
      return await this.unitModel.findOneAndUpdate(
        {
          vehicleId,
        },
        {
          vehicleMake: make,
          vehicleId: vehicleId,
          vehicleLicensePlateNo: licensePlateNo,
          manualVehicleId: manualVehicleId,
          vehicleVinNo: vehicleVinNo,
          deviceId: eldId,
          deviceSerialNo: serialNo,
          deviceVendor: vendor,
          eldNo: eldNo,
        },
        // {
        //   new: true,
        //   upsert: true,
        //   rawResult: true,
        // },
      );
    } catch (error) {
      this.logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  };

  deleteOne = async (id: string): Promise<UnitDocument> => {
    try {
      return await this.unitModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        {
          new: true,
        },
      );
    } catch (err) {
      this.logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };

  count = async (options: FilterQuery<UnitDocument>) => {
    return this.unitModel
      .count(options)
      .and([{ isDeleted: false }])
      .exec();
  };

  updateDriverStatus = async (driverId: string, dataUpdate: any) => {
    try {
      return await this.unitModel.findOneAndUpdate(
        {
          driverId,
        },
        dataUpdate,
        {
          new: true,
        },
      );
    } catch (err) {
      this.logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };

  updateHOSData = async (driverId: string, data: HOSData) => {
    try {
      return await this.unitModel.findOneAndUpdate(
        {
          driverId,
        },
        {
          ...data,
        },
        {
          new: true,
        },
      );
    } catch (err) {
      this.logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };

  updateVehicleStatus = async (vehicleId: string, isActive: boolean) => {
    try {
      return await this.unitModel.findOneAndUpdate(
        {
          vehicleId,
        },
        {
          isVehicleActive: isActive,
        },
        {
          new: true,
        },
      );
    } catch (err) {
      this.logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };

  updateDeviceStatus = async (deviceId: string, isActive: boolean) => {
    try {
      return await this.unitModel.findOneAndUpdate(
        {
          deviceId,
        },
        {
          isDeviceActive: isActive,
        },
        {
          new: true,
        },
      );
    } catch (err) {
      this.logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };
  getUnitById = async (driverId: string): Promise<UnitDocument> => {
    try {
      return await this.unitModel.findOne({ driverId: driverId });
    } catch (err) {
      this.logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };
  getOneUnit = async (option): Promise<UnitDocument> => {
    try {
      return await this.unitModel.findOne(option).lean();
    } catch (err) {
      this.logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };
  getCompany = async (tenantId: Schema.Types.ObjectId | string) => {
    try {
      const res = await firstValueFrom(
        this.companyClient.send({ cmd: 'get_company_by_id' }, tenantId),
      );
      if (res.isError) {
        Logger.log('Error in getting company info in Company service ');
        mapMessagePatternResponseToException(res);
      }
      return res.data;
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };
  findGraph = async (
    driverId: string,
    date: string,
    tenantId: Schema.Types.ObjectId,
  ) => {
    try {
      const res = await firstValueFrom(
        this.client.send(
          { cmd: 'get_driver_graph_data' },
          { driverId, date, tenantId },
        ),
      );
      if (res.isError) {
        Logger.log('Error in getting  Graph data from HOS Service');
        mapMessagePatternResponseToException(res);
      }
      return res.data;
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };
  findUpdatedData = async (
    officeId: string,
    vehicleId: string,
    headOfficeId: string,
  ) => {
    try {
      const office = await firstValueFrom(
        this.officeClient.send({ cmd: 'get_office_by_id' }, officeId),
      );
      if (office.isError) {
        mapMessagePatternResponseToException(office);
      }
      const vehicle = await firstValueFrom(
        this.vehicleClient.send({ cmd: 'get_vehicle_by_id' }, vehicleId),
      );
      if (vehicle.isError) {
        mapMessagePatternResponseToException(vehicle);
      }
      const headOffice = await firstValueFrom(
        this.officeClient.send({ cmd: 'get_office_by_id' }, headOfficeId),
      );
      if (headOffice.isError) {
        mapMessagePatternResponseToException(headOffice);
      }
      return { office, vehicle, headOffice };
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };

  updateDriverUnit = async (
    driverId: string,
    homeTerminalAddressId: string,
    homeTerminalAddress: string,
  ) => {
    try {
      const data = await this.unitModel.findOneAndUpdate(
        { driverId: driverId },
        {
          homeTerminalAddressId: homeTerminalAddressId,
          homeTerminalAddress: homeTerminalAddress,
        },
        {
          new: true,
        },
      );
      if (data && Object.keys(data).length > 0) {
        const res = await firstValueFrom(
          this.driverClient.send(
            { cmd: 'update_Unit' },
            { driverId, homeTerminalAddressId },
          ),
        );
        if (res.isError) {
          Logger.log('Error in updating Driver Unit data from Driver Service');
          mapMessagePatternResponseToException(res);
        }
      }
      return data;
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };

  // updateUnit = async (
  //   id: string,
  //   unit:UnitEditRequest
  // ): Promise<UnitDocument> => {
  //   try {
  //     return await this.unitModel.findByIdAndUpdate(id, unit, {
  //       new: true,
  //     });
  //   } catch (err) {
  //     this.logger.error({ message: err.message, stack: err.stack });
  //     throw err;
  //   }
  // };

  updateDevice = async (deviceData: DeviceRequest, upsert: boolean = true) => {
    try {
      const { id, eldNo, vendor, serialNo, tenantId } = deviceData;
      return await this.unitModel.findOneAndUpdate(
        {
          deviceId: id,
        },
        {
          deviceVendor: vendor,
          deviceSerialNo: serialNo,
          eldNo: eldNo,
          tenantId: tenantId,
        },
        {
          new: true,
          upsert,
          rawResult: true,
        },
      );
    } catch (error) {
      this.logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  };

  /**
   * V2
   * Author: Farzan
   * Get units on basis of Vin and extract deviceToken from deviceId
   */
  getUnitsByVin = async (vin: string) => {
    console.log(`IM in units service`);

    const units = await this.unitModel.find({
      vehicleVinNo: vin,
    });
    if (units.length < 1) {
      return {
        statusCode: 200,
        message: 'No units available against this Vehicle vim!',
        data: [],
      };
    }
    return {
      statusCode: 200,
      message: 'Units fetched successfully!',
      data: units,
    };
  };
  //get location
  getAddress = async (lat, long) => {
    try {
      return await getLocationDescription(lat, long);
    } catch (error) {
      throw error;
    }
  };
  /**
   * V2
   * Author: Farzan
   */

  assignMeta = async (meta, user) => {
    Logger.log(meta);
    let dateTime = moment(
      meta.lastActivity?.currentDate + meta.lastActivity?.currentTime,
      'MMDDYYHHmmss',
    ).toISOString();
    let address = meta.lastActivity.address;
    if (!address) {
              address = await this.getAddress(
          meta.lastActivity.latitude,
          meta.lastActivity.longitude,
        );
        meta.lastActivity.address = address;
  
        Logger.log("this is address : ")
        Logger.log(address)
      
      
    }

    const metaUpdated = await this.unitModel.updateOne(
      {
        driverId: user.id,
      },
      {
        lastKnownLocation: {
          address: address,
          longitude: meta.lastActivity?.longitude,
          latitude: meta.lastActivity?.latitude,
        },
        odoMeterSpeed: meta.lastActivity?.odoMeterMillage,
        // lastActivityDate: moment(

        lastActivityDate: dateTime,
        status: meta.lastActivity?.currentEventCode,
        meta: meta,
      },
    );

    if (metaUpdated.acknowledged && metaUpdated.matchedCount == 1) {
     
      return true;
    }
    console.log('meta for user not updated');

    return false;
  };

  /**
   * V2
   * Author: Farzan
   */
  updateOfficeDetials = async (object) => {
    const resp = await this.unitModel.findOneAndUpdate(
      {
        headOfficeId: object.headOfficeId,
      },
      {
        headOffice: object.headOffice,
        homeTerminalAddress: object.homeTerminalAddress,
      },
    );

    let response;
    if (!resp) {
      return (response = {
        statusCode: 200,
        message: 'Unit not found',
        data: {},
      });
    }

    return (response = {
      statusCode: 200,
      message: 'Office details in unit updated successfully!',
      data: resp,
    });
  };
  updateImageURL = async (driverId, ImageUrl) => {
    const imageUpload = await this.unitModel.updateOne(
      {
        driverId: driverId,
      },
      {
        imageName: ImageUrl,
      },
    );

    if (imageUpload.acknowledged) {
      return true;
    }
    return false;
  };
  updateUnitVehicle = async (
    vehicleData: DeviceVehicleRequest,
    upsert: boolean = true,
  ) => {
    try {
      const {
        vehicleId,
        deviceId,
        licensePlateNo,
        make,
        manualVehicleId,
        vehicleVinNo,
      } = vehicleData;

      return await this.unitModel.findOneAndUpdate(
        {
          vehicleId,
        },
        {
          vehicleMake: make,
          vehicleId: vehicleId,
          vehicleLicensePlateNo: licensePlateNo,
          manualVehicleId: manualVehicleId,
          vehicleVinNo: vehicleVinNo,
        },
        {
          new: true,
          upsert,
          rawResult: true,
        },
      );
    } catch (error) {
      this.logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  };
  updateDeviceToUnit = async (
    deviceData: VehicleDeviceRequest,
    upsert: boolean = true,
  ) => {
    try {
      const { vehicleId, deviceId, eldNo, vendor, serialNo, tenantId } =
        deviceData;
      return await this.unitModel.findOneAndUpdate(
        {
          vehicleId: vehicleId,
        },
        {
          deviceId: deviceId,
          deviceVendor: vendor,
          deviceSerialNo: serialNo,
          eldNo: eldNo,
          tenantId: tenantId,
        },
        // {
        //   new: true,
        //   upsert,
        //   rawResult: true,
        // },
      );
    } catch (error) {
      this.logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  };
  updateUnitByAddDriver = async (
    vehicleData: DriverVehicleToUnitRequest,
    upsert: boolean = true,
  ) => {
    try {
      const { driverId } = vehicleData;

      return await this.unitModel.findOneAndUpdate(
        {
          driverId,
        },
        vehicleData,
        {
          new: true,
          upsert,
          rawResult: true,
        },
      );
    } catch (error) {
      this.logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  };
  updateCoDriverUnit = async (
    deviceData: CoDriverUnitUpdateRequest,
    upsert: boolean = true,
  ) => {
    try {
      const {
        driverId,
        vehicleId,
        deviceId,
        coDriverId,
        eldNo,
        deviceVendor,
        deviceSerialNo,
        manualVehicleId,
        vehicleMake,
        vehicleLicensePlateNo,
        vehicleVinNo,
      } = deviceData;
      return await this.unitModel.findOneAndUpdate(
        {
          driverId: driverId,
        },
        {
          vehicleId,
          deviceId,
          coDriverId,
          deviceVendor,
          deviceSerialNo,
          eldNo,
          manualVehicleId,
          vehicleMake,
          vehicleLicensePlateNo,
          vehicleVinNo,
        },
      );
    } catch (error) {
      this.logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  };
}
