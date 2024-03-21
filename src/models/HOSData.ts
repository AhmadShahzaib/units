export class HOSData {
  driverId: string;
  odoMeterSpeed?: number;
  lastKnownLocation?: {
    longitude: number;
    latitude: number;
    address?: string;
  };
  lastActivityDate: number;
  deviceVersion: string;
  eldType: string;
  deviceModel: string;
  status: string;
}
