// import { Logger } from '@nestjs/common';
// import { mapMessagePatternResponseToException } from '@shafiqrathore/logeld-tenantbackend-common-future';
// import { UnitService } from 'app.service';
// import { UnitEditRequest } from 'models/editUnitRequestModel';

// export const UnitUpdateByDriverId = async (
//   driverId: string,
//   editRequestData: UnitEditRequest,
//   unitService: UnitService,
// ) => {
//   try {
//     let { office, vehicle, headOffice } = await unitService.findUpdatedData(
//       editRequestData.homeTerminalAddressId,
//       editRequestData.vehicleId,
//       editRequestData.headOfficeId,
//     );
//     let officetermianl = office.data;
//     let headTerminal = headOffice.data;
//     let vechileRes = vehicle.data;
//     if (officetermianl && headTerminal && vechileRes) {
//       let res = await unitService.updateUnit(driverId, {
//         headOffice: headTerminal.address,
//         headOfficeId: headTerminal.id,
//         homeTerminalAddress: officetermianl.address,
//         homeTerminalAddressId: officetermianl.id,
//         vehicleId: vechileRes.id,
//         manualVehicleId: vechileRes.vehicleId,
//         deviceId: vechileRes.eldId,
//         make: vechileRes.make,
//         licensePlateNo: vechileRes.licensePlateNo,
//         vehicleVinNo: vechileRes.vinNo,
//         trailerNumber: editRequestData.trailerNumber,
//         shipingDocument: editRequestData.shipingDocument,
//         imagekey: editRequestData.imageKey,
//         imageName: editRequestData.imageName,
//       });
//       let driverUnit = await unitService.updateDriverUnit({
//         driverId: driverId,
//         vehicleId: vechileRes.id,
//         trailerNumber: editRequestData.trailerNumber,
//         homeTerminalAddress: officetermianl.id,
//       });
//       return res;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     Logger.error({ message: error.message, stack: error.stack });
//     throw error;
//   }
// };
