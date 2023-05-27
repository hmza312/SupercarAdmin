import { Timestamp } from "firebase/firestore";

export type PaymentDocType = {
    amount: number,
    id: string,
    recipient: string,
    sender: string,
    status: boolean,
    timestamp: number  
};


