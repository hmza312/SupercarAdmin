import { MemberDocType } from "@/lib/firebase_docstype";

export interface VehiclesFilter {
    customers: Array<MemberDocType>;
    input: string,
    selectedCustomer: string | null
}


