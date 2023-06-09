import { MemberDocType, PaymentDocType, VehicleDocType } from '@/lib/firebase_docstype';

export function fromFirebaseTimeStamp(time: any): Date {
   const fireBaseTime = new Date(time.seconds * 1000 + time.nanoseconds / 1000000);
   return fireBaseTime;
}

export function localTimeStamp(): number {
   const date = new Date();
   const unixTimestamp = Math.floor(date.getTime() / 1000);
   return unixTimestamp;
}

export function localTimeStampFromDate(date: Date): number {
   const unixTimestamp = Math.floor(date.getTime() / 1000);
   return unixTimestamp;
}

export function formatChatDate(date: Date): string {
   const today = new Date(); // Current date

   const isSameDate =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

   if (isSameDate) {
      const hours = date.getHours();
      const minutes = date.getMinutes();

      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
         .toString()
         .padStart(2, '0')}`;

      return `Today @ ${formattedTime}`;
   } else {
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours < 12 ? 'am' : 'pm';

      return `${month} ${day} @ ${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
   }
}

export function getFileNameAndExtension(file: Blob): { name: string; extension: string } {
   const filePath = file.name;
   const fileName = filePath.split('/').pop() || '';
   const fileParts = fileName.split('.');
   const name = fileParts[0];
   const extension = fileParts.length > 1 ? fileParts[fileParts.length - 1] : '';

   return { name, extension };
}

export function calculatePercentageChange(
   members: MemberDocType[],
   vehicles: VehicleDocType[]
): [number, number] {
   const currentTimestamp = Math.floor(Date.now() / 1000); // Current Unix timestamp
   const oneWeekInSeconds = 7 * 24 * 60 * 60;

   const previousWeekStart = currentTimestamp - oneWeekInSeconds;
   const previousWeekEnd = currentTimestamp;

   const previousWeekMembers = members.filter(
      (member) => member.joined >= previousWeekStart && member.joined <= previousWeekEnd
   );

   const previousWeekPayments = vehicles.filter(
      (vehicle) => vehicle.timestamp >= previousWeekStart && vehicle.timestamp <= previousWeekEnd
   );

   const currentWeekMembers = members.filter((member) => member.joined > previousWeekEnd);

   const currentWeekPayments = vehicles.filter((vehicle) => vehicle.timestamp > previousWeekEnd);

   const memberChange = currentWeekMembers.length - previousWeekMembers.length;
   const paymentChange = currentWeekPayments.length - previousWeekPayments.length;

   return [memberChange, paymentChange];
}

export const countVehicleByMonth = (vehicles: VehicleDocType[]): Record<string, number> => {
   const monthCounts: Record<string, number> = {};

   // Initialize monthCounts with zero counts for all months
   const currentDate = new Date();
   const currentYear = currentDate.getFullYear();
   const monthNames = Array.from({ length: 12 }, (_, monthIndex) => {
      const date = new Date(currentYear, monthIndex);
      return date.toLocaleString('en-US', { month: 'long' });
   });
   monthNames.forEach((monthName) => {
      monthCounts[monthName] = 0;
   });

   vehicles.forEach((vehicle) => {
      const timestamp = vehicle.timestamp;
      const date = new Date(timestamp * 1000);

      if (isNaN(date.getTime())) {
         // Skip members with invalid dates
         return;
      }

      const month = date.toLocaleString('en-US', { month: 'long' });

      monthCounts[month]++;
   });

   return monthCounts;
};

export function fileToBlob(file: File): Blob {
   const blobFile = new Blob([file], { type: file.type });
   return blobFile;
}
