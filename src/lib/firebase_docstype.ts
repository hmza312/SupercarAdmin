import { Timestamp } from "firebase/firestore";

export type PaymentDocType = {
  amount: number;
  id: string;
  recipient: string;
  sender: string;
  status: boolean;
  timestamp: number;
};

export type MemberDocType = {
  address: string;
  dob: number;
  email: string;
  industry: string;
  instagram: string;
  joined: number;
  mobile: string;
  name: string;
  occupation: string;
  permitted: boolean;
  photo: string | undefined;
  authenticated: string;
  deleted: boolean | undefined;
};
