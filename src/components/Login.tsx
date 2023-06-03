import {
   ConfirmationResult,
   getAuth,
   PhoneAuthProvider,
   RecaptchaVerifier,
   signInWithPhoneNumber
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Button, Center, Flex, Heading, Input, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useMediaQuery } from '@chakra-ui/react';
import { firebase } from '@/lib/firebase';
import { ModalInput } from './design/ModalWrapper';
import WhiteButton from './design/WhiteButton';

const Login = () => {
   const [input, setInput] = useState<string>('');
   const [confirmationResult, setConfirmationResult ]= useState<ConfirmationResult | null>(null)
   const [code, setCode]= useState<string>('')
   const [tabIdx, setTabIdx] = useState<number>(0)

   const loginUser = async () => {
      const auth = firebase.firebaseAuth;

      const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
         'size': 'normal',
         'callback': (response: any) => {},
         'expired-callback': () => {}
      }, auth);

      await recaptchaVerifier.render();
      await recaptchaVerifier.verify();

      const appVerifier = recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, input, appVerifier);
      setConfirmationResult(confirmationResult);
      setTabIdx(1);
   };

   const VerifyCode = async () => {
      if (!confirmationResult) return;
      const res = await confirmationResult.confirm(code);
      console.log ("Here We go :)" , res);
   };
   
   const [isUnder500] = useMediaQuery("(max-width: 500px)")
   
   return (
      <>
         <Flex width={'100%'} height={'100%'} 
            bg={'var(--grey-color)'} pt={'4rem'} alignItems={'center'} rounded={'xl'}
            flexDir={'column'} gap={'2rem'} p={isUnder500 ? '0.5rem' : '1rem'}
            
         >
         <Tabs size={'sm'} variant='soft-rounded' border={'1px solid var(--white-color)'} 
            p={isUnder500 ? '0.5rem' : '4rem'} pt={'1rem'}  rounded={'xl'}
            index={tabIdx} defaultIndex={0}
         >
            <Center my={'1rem'}>
               <Heading>Login Form</Heading>
            </Center>
            <TabList gap={'1rem'}>
              <Tab bg={'var(--orange-color)'} color={'white'} _selected={{ bg: 'var(--orange-color)'}} isDisabled={confirmationResult != null}>
                  Phone Number
              </Tab>
              <Tab bg={'var(--orange-color)'} color={'white'} _selected={{ bg: 'var(--orange-color)'}} isDisabled={confirmationResult == null}>
                  Verify Number
               </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <ModalInput labelValue='Enter Phone Number' 
                placeholder='e.g.  +1 650-555-3434.'
                value={input} onChange={(e)=> {
                  setInput(e.target.value);
                }} my={'1rem'}/>
                <div id='recaptcha-container'></div>
                <Center my={'1rem'}>
                  <WhiteButton onClick={loginUser}>Send Code</WhiteButton>
                </Center>
              </TabPanel>
              <TabPanel>
               <ModalInput labelValue='Enter 6 Digits Verification Code' 
                 placeholder='e.g.  +1 650-555-3434.'
                 value={code} onChange={(e)=> {
                   setCode(e.target.value);
               }} my={'1rem'}/>
               <Center>
                  <WhiteButton onClick={VerifyCode} my={'1rem'}>Verify</WhiteButton>
               </Center>
              </TabPanel>
            </TabPanels>
            </Tabs>
         </Flex>
         {/* 
         <Text>Enter Phone Number</Text>
         <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter phone number"
         />
         <Button
            onClick={(e) => {
               loginUser();
            }}
         >
            Login
         </Button>

         {confirmationResult && <>
            <Input value={code}  onChange = {(e)=> setCode(e.target.value)} type='number'/>
            <Button onClick={VerifyCode}>Verify</Button>
         </>} */}
      </>
   );
};

export default Login;
