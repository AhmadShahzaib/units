import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';

const TimeZoneSchema = new mongoose.Schema(
  {
    tzCode: { type: String, required: true },
    utc: { type: String, required: true },
    label: { type: String },
    name: { type: String },
  },
  { _id: false },
);

const Documents = new mongoose.Schema(
  {
    name: { type: String, required: false },
    key: { type: String, required: false },
    date: { type: Number, required: false },
  },
  { _id: true },
);

export const UnitSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: null,
      index: true,
    },

    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: null,
      index: true,
    },
    homeTerminalTimeZone: {
      type: TimeZoneSchema,
      require: true,
      default: null,
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: null,
      index: true,
    },
    deviceVendor: { type: String, required: true, index: true, default: null },
    deviceSerialNo: {
      type: String,
      required: true,
      index: true,
      default: null,
    },
    driverUserName: {
      type: String,
      required: true,
      index: true,
      default: null,
    },
    driverLicenseState: {
      type: String,
      required: true,
      index: true,
      default: null,
    },
    driverLicense: {
      type: String,
      required: true,
      index: true,
      default: null,
    },
    shipingDocument: {
      type: String,
      required: false,
      index: true,
      default: null,
    },
    trailerNumber: {
      type: String,
      index: true,
      default: null,
    },
    vehicleVinNo: {
      type: String,
      required: true,
      index: true,
      default: null,
    },
    cycleRule: {
      type: String,
      required: false,
      index: true,
      default: null,
    },
    homeTerminalAddress: {
      type: String,
      required: true,
      index: true,
      default: null,
    },
    vehicleLicensePlateNo: {
      type: String,
      required: true,
      index: true,
      default: null,
    },
    vehicleMake: { type: String, required: true, index: true, default: null },
    manualVehicleId: {
      type: String,
      required: true,
      index: true,
      default: null,
    },
    eldNo: { type: String, required: true, index: true, default: null },
    manualDriverId: {
      type: String,
      required: true,
      index: true,
      default: null,
    },
    driverFirstName: {
      type: String,
      required: true,
      index: true,
      default: null,
    },
    driverLastName: {
      type: String,
      required: true,
      index: true,
      default: null,
    },
    driverFullName: {
      type: String,
    },
    lastKnownLocation: {
      required: false,
      longitude: Number,
      latitude: Number,
      address: String,
    },
    status: { type: String, required: false, default: null },
    lastActivityDate: {},
    odoMeterSpeed: { required: false, type: Number },
    coDriverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
      index: true,
    },
    headOfficeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: null,
      index: true,
    },
    imageKey: {
      type: String,
      require: false,
      default: null,
    },
    imageName: {
      type: String,
      require: false,
      default: null,
    },
    homeTerminalAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: null,
      index: true,
    },
    isDeviceActive: { type: Boolean, required: true, default: true },
    isVehicleActive: { type: Boolean, required: true, default: true },
    isDriverActive: { type: Boolean, required: true, default: true },
    headOffice: {
      type: String,
      required: true,
      index: true,
      default: null,
    },
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, default: false },
    isCoDriver: { type: Boolean, default: false },
    tenantId: { type: Schema.Types.ObjectId },
    deviceVersion: { type: String, required: false },
    eldType: { type: String, required: false },
    deviceModel: { type: String, required: false },
    meta: { type: {} },
    isTimeChange: { type: Boolean, default: false },
    timezoneOffset: { type: String, default: '' },
    driverEmail: { type: String, required: true, index: true },
    phoneNumber: { type: String, required: true },
    vehicles: [{}],
    driverProfile: { type: Documents, required: false },
    enableEld: { type: Boolean, required: true },
    enableElog: { type: Boolean, required: true },
    yardMove: { type: Boolean, required: true },
    personalConveyance: { type: Boolean, required: true },
    deviceToken: { type: String, default: '' },
  },
  { timestamps: true },
);
