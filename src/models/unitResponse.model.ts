import UnitDocument from '../mongoDb/document/document';
import { Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseType } from '@shafiqrathore/logeld-tenantbackend-common-future';
import { TimeZoneModel } from './timeZoneResponse';

export class UnitResponse extends BaseResponseType {
  @ApiProperty()
  id: Schema.Types.ObjectId;
  @ApiProperty()
  driverId: string;
  @ApiProperty()
  vehicleId: Schema.Types.ObjectId;
  @ApiProperty()
  deviceId: Schema.Types.ObjectId;
  @ApiProperty()
  deviceVendor: string;
  @ApiProperty()
  deviceSerialNo: string;
  @ApiProperty()
  vehicleLicensePlateNo: string;
  @ApiProperty()
  vehicleMake: string;
  @ApiProperty()
  manualVehicleId: string;
  @ApiProperty()
  eldNo: string;
  @ApiProperty()
  manualDriverId: string;
  @ApiProperty()
  driverFirstName: string;
  @ApiProperty()
  driverLastName: string;
  @ApiProperty()
  driverFullName: string;
  @ApiProperty()
  lastKnownLocation: {
    longitude: number;
    latitude: number;
    address?: string;
  };
  @ApiProperty()
  homeTerminalTimeZone: TimeZoneModel;
  @ApiProperty()
  driverLicense: string;
  @ApiProperty()
  trailerNumber: string;
  @ApiProperty()
  homeTerminalAddress: string;
  @ApiProperty()
  headOffice: string;
  @ApiProperty()
  headOfficeId: string;
  @ApiProperty()
  homeTerminalAddressId: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  lastActivityDate: number;
  @ApiProperty()
  isDriverActive: boolean;
  @ApiProperty()
  isVehicleActive: boolean;
  @ApiProperty()
  driverUserName: string;
  @ApiProperty()
  driverLicenseState: string;
  @ApiProperty()
  isDeviceActive: boolean;
  @ApiProperty()
  tenantId: Schema.Types.ObjectId;
  @ApiProperty()
  odoMeterSpeed?: number;
  @ApiProperty()
  isActive: boolean;
  meta: { type: {} };
  violations: any;
  ptiType: string;
  isTimeChange: boolean;
  timezoneOffset: string;
  deviceToken: string;

  constructor(unitDocument: UnitDocument) {
    super();
    this.id = unitDocument.id;
    this.driverId = unitDocument.driverId;
    this.vehicleId = unitDocument.vehicleId;
    this.deviceId = unitDocument.deviceId;
    this.deviceVendor = unitDocument.deviceVendor;
    this.deviceSerialNo = unitDocument.deviceSerialNo;
    this.vehicleLicensePlateNo = unitDocument.vehicleLicensePlateNo;
    this.vehicleMake = unitDocument.vehicleMake;
    this.manualVehicleId = unitDocument.manualVehicleId;
    this.eldNo = unitDocument.eldNo;
    this.manualDriverId = unitDocument.manualDriverId;
    this.lastKnownLocation = unitDocument.lastKnownLocation;
    this.driverUserName = unitDocument.driverUserName;
    this.driverLicenseState = unitDocument.driverLicenseState;
    this.odoMeterSpeed = unitDocument.odoMeterSpeed;
    this.driverFirstName = unitDocument.driverFirstName;
    this.driverLastName = unitDocument.driverLastName;
    this.driverFullName = unitDocument.driverFullName;
    this.isDriverActive = unitDocument.isDriverActive;
    this.isVehicleActive = unitDocument.isVehicleActive;
    this.isDeviceActive = unitDocument.isDeviceActive;
    this.status = unitDocument.status;
    this.lastActivityDate = unitDocument.lastActivityDate;
    this.tenantId = unitDocument.tenantId;
    this.isActive = unitDocument.isActive;
    this.homeTerminalAddress = unitDocument.homeTerminalAddress;
    this.homeTerminalTimeZone = unitDocument.homeTerminalTimeZone;
    this.meta = unitDocument.meta;
    this.violations = unitDocument.violations;
    this.deviceToken = unitDocument.deviceToken;
  }
}
