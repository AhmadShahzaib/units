import { TimeZone } from 'models/driverVehicleRequest';
import { Document, Schema } from 'mongoose';
type StringOrTimeZone = string | TimeZone | object;
import { TimeZoneModel } from '../../models/timeZoneResponse';
export type Documents = {
  name?: string;
  date?: number;
  key?: string;
};
export default interface UnitDocument extends Document {
  driverId: string;
  vehicleId: Schema.Types.ObjectId;
  deviceId: Schema.Types.ObjectId;
  coDriverId?: Schema.Types.ObjectId;
  deviceVendor: string;
  deviceSerialNo: string;
  vehicleLicensePlateNo: string;
  vehicleMake: string;
  imageName: string;
  vehicleVinNo: string;
  manualVehicleId: string;
  shipingDocument?: string;
  eldNo: string;
  lastKnownLocation?: {
    longitude: number;
    latitude: number;
    address?: string;
  };
  status?: string;
  lastActivityDate: any;
  odoMeterSpeed: number;
  headOffice: string;
  homeTerminalTimeZone: TimeZoneModel;
  manualDriverId: string;
  driverLicense: string;
  trailerNumber?: string;
  imageKey: string;
  homeTerminalAddress: string;
  driverUserName: string;
  driverLicenseState: string;
  headOfficeId: string;
  homeTerminalAddressId: string;
  driverFirstName: string;
  driverLastName: string;
  driverFullName: string;
  isDriverActive: boolean;
  isVehicleActive: boolean;
  isDeviceActive: boolean;
  cycleRule: string;
  tenantId: Schema.Types.ObjectId;
  isActive: boolean;
  deviceVersion: string;
  eldType: string;
  deviceModel: string;
  meta: { type: {} };
  violations: [];
  ptiType: String;
  isTimeChange:boolean;
  timezoneOffset:string;
  driverProfile?: Documents;
  vehicles: [{}];
  driverEmail: string;
  phoneNumber: string;
  enableEld: boolean;
  enableElog: boolean;
  yardMove: boolean;
  personalConveyance: boolean;
  deviceToken:string;
}