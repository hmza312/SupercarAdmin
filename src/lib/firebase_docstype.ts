export type VehicleDocType = {
   owner: string;
   cutout: string;
   id: string;
   make: string;
   model: string;
   odometer: string;
   status: number;
   t: string;
   thumbnail: string;
   title: string;
   trim: string;
   vin: string;
   year: string;
   owner_data: MemberDocType | null;
};

export type PaymentDocType = {
   amount: number;
   id: string;
   recipient: string;
   sender: string;
   status: number;
   timestamp: number;
   vehicle: string;
   user_data: MemberDocType | null;
   vehicle_data: VehicleDocType | null;
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
   uid: string;
   isAdmin: boolean;
   payments: Array<PaymentDocType> | null;
   vehicles: Array<VehicleDocType> | null;
};

export type RequestDocType = {
   call_type: string;
   created: number;
   id: string;
   status: number;
   title: string;
   user: string;
   user_email: string;
   user_mobile: string;
   user_name: string;
   user_data: MemberDocType | null;
};

export type MessageDocType = {
   contents: string;
   id: string;
   sender: string;
   timestamp: number;
   type: number;
   avatar?: string | undefined;
};

