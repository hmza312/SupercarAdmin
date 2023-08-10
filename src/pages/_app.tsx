import SideBar from '@/components/SideBar';
import '@/styles/globals.css';
import 'react-datepicker/dist/react-datepicker.css';
import type { AppProps } from 'next/app';

import { ChakraProvider, Flex, useMediaQuery } from '@chakra-ui/react';
import { appTheme } from '@/styles/Style';
import DarkTheme from '@/components/design/DarkTheme';
import CredentialsProvider from '@/lib/CredentialsProvider';
import { useEffect, useState } from 'react';
import { MemberDocType } from '@/lib/firebase_docstype';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebase, membersColRef } from '@/lib/firebase';
import Login from '@/components/Login';
import { getDocs, query, where } from 'firebase/firestore';

export default function App({ Component, pageProps }: AppProps) {
   const [isUnder1100] = useMediaQuery('(max-width: 1100px)');
   const [user, setUser] = useState<MemberDocType | null>(null);
   const [loggedInUser] = useAuthState(firebase.firebaseAuth);

   

   return (
      <>
         <ChakraProvider theme={appTheme}>
            <CredentialsProvider.Provider value={[user, setUser]}>
               <DarkTheme />
                  <Flex
                     display={'flex'}
                     height={'100%'}
                     width={'100%'}
                     flexDir={isUnder1100 ? 'column' : 'row'}
                  >
                     <SideBar useMobStyle={isUnder1100} />
                     <Component {...pageProps} />
                  </Flex>
            </CredentialsProvider.Provider>
         </ChakraProvider>
      </>
   );
}
