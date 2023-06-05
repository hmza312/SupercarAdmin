import { UseDisclosureProp } from '@/types/UseDisclosureProp';
import DatePicker from 'react-datepicker';
import ModalWrapper, { ModalDropDown, ModalInput } from '../design/ModalWrapper';
import { Flex, Heading, Text, useToast } from '@chakra-ui/react';
import OrangeButton from '../design/OrangeButton';
import { useState } from 'react';
import { ValidateType } from '@/types/ValidateType';
import { callsColRef } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { localTimeStampFromDate } from '@/util/helpers';

export const ScheduleMeetingModal = ({
   handler,
   userId,
   docId,
   userName
}: {
   userName: string;
   docId: string;
   handler: UseDisclosureProp;
   userId: string;
}) => {
   const ContactType = ['FaceTime', 'Phone Call', 'Google Meets', 'Zoom'];

   const [contactType, setContactType] = useState<ValidateType<string>>({ value: '', error: null });
   const [uid, setUId] = useState<ValidateType<string>>({ value: userId, error: null });
   const [password, setPassword] = useState<ValidateType<string>>({ value: userId, error: null });
   const [date, setDate] = useState<ValidateType<Date | null>>({ value: new Date(), error: null });

   const resetState = () => {
      setContactType({ value: '', error: null });
      setUId({ value: userId, error: null });
      setPassword({ value: '', error: null });
      setDate({ value: new Date(), error: null });
   };

   const toast = useToast();

   const handleScheduleNow = () => {
      // Validate Contact Type
      setContactType((prev) => ({
         ...prev,
         error: prev.value ? null : 'Please select a contact type'
      }));

      // Validate Username
      setUId((prev) => ({
         ...prev,
         error: prev.value.length > 0 ? null : 'Invalid user id'
      }));

      // Validate Scheduled Time
      const currentTime = new Date();
      setDate((prev) => ({
         ...prev,
         error:
            prev.value && prev.value <= currentTime ? 'Scheduled time must be in the future' : null
      }));

      // Clear password error (optional field)
      setPassword((prev) => ({
         ...prev,
         error: null
      }));

      // Submit the form or perform any further actions
      if (contactType.error == null && uid.error == null && date.error == null) {
         resetState();

         const docRef = doc(callsColRef, docId);
         updateDoc(docRef, {
            call_meetingpassword: password.value,
            call_type: contactType.value,
            user_name: userName,
            user: uid.value,
            scheduled: localTimeStampFromDate(date.value || new Date())
         })
            .then(() => {
               toast({
                  title: 'Succeed',
                  description: 'Meeting has been Secluded',
                  position: 'bottom',
                  status: 'success'
               });
            })
            .catch(() => {
               toast({
                  title: 'Upload Fail',
                  description: 'Something Went Wrong!',
                  position: 'bottom',
                  status: 'error'
               });
            });
      }
   };

   return (
      <>
         <ModalWrapper {...handler}>
            <Flex alignItems={'center'} flexDir={'column'} color={'black'} gap={'1rem'}>
               <Heading fontSize={'20px'} fontWeight={'700'}>
                  Schedule Meeting
               </Heading>
               <Flex flexDir={'column'} width={'100%'} gap={'0.5rem'}>
                  <ModalDropDown
                     labelValue={'Contact Type'}
                     menuItems={ContactType}
                     menuTitle={contactType.value.length > 0 ? contactType.value : 'Please Select'}
                     onSelected={(s) => {
                        setContactType({ ...contactType, value: s });
                     }}
                     error={contactType.error}
                  />
                  <ModalInput
                     labelValue="ID/Username"
                     isDisabled={true}
                     value={uid.value}
                     error={uid.error}
                  />
                  <ModalInput
                     labelValue="Password (Optional)"
                     placeholder="e.g. Mandatory for all cusotmers"
                     isOptional={true}
                     value={password.value}
                     onChange={(e) => {
                        setPassword({ ...password, value: e.target.value });
                     }}
                     error={password.error}
                  />
                  <Flex flexDir={'column'}>
                     <Text mb="2px" fontWeight={'600'} fontSize={'15px'}>
                        {'Scheduled Time'}
                     </Text>
                     <DatePicker
                        selected={date.value}
                        onChange={(e) => {
                           setDate({ ...date, value: e });
                        }}
                     />
                     {date.error && <Text color={'red.400'}>{date.error}</Text>}
                  </Flex>
               </Flex>
               <OrangeButton width={'100%'} onClick={handleScheduleNow}>
                  Schedule Now
               </OrangeButton>
            </Flex>
         </ModalWrapper>
      </>
   );
};
