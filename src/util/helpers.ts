export function fromFirebaseTimeStamp(time: any): Date {
  const fireBaseTime = new Date(
    time.seconds * 1000 + time.nanoseconds / 1000000
  );
  return fireBaseTime;
}
