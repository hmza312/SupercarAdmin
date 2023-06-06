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


export function getFileNameAndExtension(file: Blob): { name: string, extension: string } {
   const filePath = file.name;
   const fileName = filePath.split('/').pop() || '';
   const fileParts = fileName.split('.');
   const name = fileParts[0];
   const extension = fileParts.length > 1 ? fileParts[fileParts.length - 1] : '';
 
   return { name, extension };
}
