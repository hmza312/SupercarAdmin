import {
   getAuth,
   PhoneAuthProvider,
   RecaptchaVerifier,
   signInWithPhoneNumber
} from 'firebase/auth';
import { useState } from 'react';
import { Button, Input, Text } from '@chakra-ui/react';
import { firebase } from '@/lib/firebase';

const Login = () => {
   const [input, setInput] = useState<string>('');

   const onSignInSubmit = () => {};

   const loginUser = () => {
      const auth = firebase.firebaseAuth;
      const recaptchaVerifier = new RecaptchaVerifier(
         'sign-in-button',
         {
            size: 'invisible',
            callback: (response: any) => {
               console.log(response);
               // reCAPTCHA solved, allow signInWithPhoneNumber.
               onSignInSubmit();
            }
         },
         auth
      );
   };

   return (
      <>
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
      </>
   );
};

export default Login;
