import UnitDocument from '../mongoDb/document/document';
import { Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseType } from '@shafiqrathore/logeld-tenantbackend-common-future';
import { TimeZoneModel } from './timeZoneResponse';

export class TrackingListing extends BaseResponseType {
  @ApiProperty()
  id: Schema.Types.ObjectId;
  @ApiProperty()
  driverId: string;
 

  @ApiProperty()
  manualVehicleId: string;


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
  trailerNumber: string;
  @ApiProperty()
  homeTerminalAddress: string;
 
 
  @ApiProperty()
  status: string;
  @ApiProperty()
  lastActivityDate: number;
 
  @ApiProperty()
  driverUserName: string;
  
  @ApiProperty()
  tenantId: Schema.Types.ObjectId;
  @ApiProperty()
  odoMeterSpeed?: number;
  @ApiProperty()
  isActive: boolean;
  meta: { type: {} };
  violations: any;
  ptiType: String;
  isTimeChange: boolean;
  timezoneOffset: string;
  deviceToken: string;
lastActivity: { type: {} };
  constructor(unitDocument: UnitDocument) {
    super();
    this.id = unitDocument.id;
    this.driverId = unitDocument.driverId;
  
    this.manualVehicleId = unitDocument.manualVehicleId;
   
    this.lastKnownLocation = unitDocument.lastKnownLocation;
    this.driverUserName = unitDocument.driverUserName;
   
    this.odoMeterSpeed = unitDocument.odoMeterSpeed;
    this.driverFirstName = unitDocument.driverFirstName;
    this.driverLastName = unitDocument.driverLastName;
    this.driverFullName = unitDocument.driverFullName;
   
    this.status = unitDocument.status;
    this.lastActivityDate = unitDocument.lastActivityDate;
    this.tenantId = unitDocument.tenantId;
    this.isActive = unitDocument.isActive;
    this.homeTerminalAddress = unitDocument.homeTerminalAddress;
    this.homeTerminalTimeZone = unitDocument.homeTerminalTimeZone;
    this.lastActivity = unitDocument.meta['lastActivity'];
    this.violations = unitDocument.violations;
    this.deviceToken = unitDocument.deviceToken;
  }
}
