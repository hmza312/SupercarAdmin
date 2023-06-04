import { UseStateProps } from '@/types/UseStateProps';
import { createContext } from 'react';
import { MemberDocType } from './firebase_docstype';

const CredentialsProvider = createContext<UseStateProps<MemberDocType | null>>({} as any);

export default CredentialsProvider;
