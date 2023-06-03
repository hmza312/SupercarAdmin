import { ROUTING } from '@/util/constant';
import { ChevronLeftIcon, SearchIcon } from '@chakra-ui/icons';
import {
   Avatar,
   Box,
   Button,
   Center,
   Flex,
   Heading,
   Icon,
   Input,
   InputGroup,
   InputRightElement,
   Spinner,
   Stack,
   Text,
   useDisclosure,
   useMediaQuery
} from '@chakra-ui/react';
import Link from 'next/link';
import OrangeButton from '../design/OrangeButton';
import { BsEmojiSmile, BsSend } from 'react-icons/bs';
import { ImAttachment } from 'react-icons/im';
import WhiteButton from '../design/WhiteButton';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc, getDocs } from 'firebase/firestore';
import { conversationsColRef, membersColRef } from '@/lib/firebase';
import ModalWrapper, { ModalDropDown } from '../design/ModalWrapper';
import { UseDisclosureProp } from '@/types/UseDisclosureProp';

const ChatRoom = () => {
   const router = useRouter();
   const [customer, setCustomer] = useState<MemberDocType | null>(null);
   const [isUnder850] = useMediaQuery("(max-width: 850px)");

   useEffect(() => {
      const customerId = router.asPath.split('/').at(-1);

      const getConversations = async () => {
         const customerDocRef = doc(membersColRef, customerId);
         const customerDoc = (await getDoc(customerDocRef)).data();
         setCustomer(customerDoc as MemberDocType);
         const conversationDocs = await getDocs(conversationsColRef);

         console.log(conversationDocs.docs.map((d) => d.data()));
      };
      
      getConversations();
   }, []);

   const { isOpen, onOpen, onClose } = useDisclosure();
   const sideBarHandle = useDisclosure(); 

   return (
      <>
         <Flex width={'100%'} height={'100%'} gap={'0.5rem'} flexDir={'column'}>
            <BackBtn />

            <Flex flex={''} gap={'1rem'} height={'85%'}>
               {/* Chatroom */}
               <Flex height={'100%'} width={'100%'} flex={2} gap={'1rem'} flexDir={'column'}>
                  <Box width={'100%'}>
                     {customer ? (
                        <>
                           <ChatHeader
                              avatar={customer.photo || ''}
                              customerName={customer.name}
                              occupation={customer.occupation}
                           />
                        </>
                     ) : (
                        <>
                           <Spinner />
                        </>
                     )}
                  </Box>
                  <ChatContainer />
               </Flex>
               {isUnder850 ? <>
                  <DrawerWrapper isOpen={sideBarHandle.isOpen} onClose={sideBarHandle.onClose}>
                     <SideBar newDocUploadHandle={{ isOpen, onOpen, onClose }} />
                  </DrawerWrapper>
               </>:
               <SideBar newDocUploadHandle={{ isOpen, onOpen, onClose }} />}
            </Flex>
         </Flex>

         <NewDocumentUpload handler={{ isOpen, onOpen, onClose }} />
      </>
   );
};

const BackBtn = () => (
   <Link href={ROUTING.customers}>
      <Heading fontWeight={'600'} fontSize={'2xl'} py={'1rem'}>
         <ChevronLeftIcon />
         {`Back to customers`}
      </Heading>
   </Link>
);

const ChatHeader = ({
   customerName,
   avatar,
   occupation
}: {
   customerName: string;
   avatar: string;
   occupation: string;
}) => (
   <Flex width={'100%'} p={'1rem'} bg={'var(--grey-color)'} rounded={'lg'} gap={'1rem'}>
      <Avatar src={avatar} />
      <Stack spacing={'-0.1rem'} color={'var(--info-text-color)'}>
         <Heading fontSize={'xl'} fontWeight={'600'}>
            {customerName}
         </Heading>
         <Text fontSize={'small'} fontWeight={'500'}>
            {occupation}
         </Text>
      </Stack>
   </Flex>
);

const ChatContainer = () => {
   const [isUnder500] = useMediaQuery('(max-width: 500px)');

   return (
      <Flex
         height={'100%'}
         width={'100%'}
         bg={'var(--grey-color)'}
         overflow={'auto'}
         p={'0.5rem'}
         rounded={'lg'}
         flexDir={'column'}
         gap={'0.5rem'}
      >
         {/* chat container */}
         <Flex flex={1} width={'100%'} overflowY={'auto'} maxH={'100%'} flexDir={'column'}>
            <Center color={'var(--white-color)'}>No Conversation So far</Center>
            {/* <ChatMessage messagePos="left" />
            <ChatMessage messagePos="right" />
            <ChatMessage messagePos="left" />
            <ChatMessage messagePos="right" />
            <ChatMessage messagePos="left" />
            <ChatMessage messagePos="left" />
            <ChatMessage messagePos="left" /> */}
         </Flex>

         {/* search box */}
         <Flex width={'100%'} marginTop={'auto'}>
            <InputGroup size={'md'} colorScheme="gray" rounded={'full'}>
               <Input
                  pr="0.5rem"
                  width={'100%'}
                  placeholder="Write a message..."
                  background={'var(--light-grey-color)'}
                  border={'none'}
                  p={'1.5rem'}
                  _placeholder={{
                     color: 'var(--white-color)',
                     fontSize: '12px',
                     transform: 'translateY(-1px)'
                  }}
                  rounded={'full'}
               />
               <InputRightElement height={'100%'} width={'30%'}>
                  {' '}
                  <Flex alignItems={'center'} gap={'0.4rem'} ml={'auto'} pr={'0.3rem'}>
                     <Icon fontSize={'xl'}>
                        <ImAttachment />
                     </Icon>

                     <Icon fontSize={'xl'}>
                        <BsEmojiSmile />
                     </Icon>

                     <Button
                        colorScheme="whatsapp"
                        rounded={'50%'}
                        minH={'37px'}
                        minW={'37px'}
                        maxH={'37px'}
                        maxW={'37px'}
                        marginLeft={'auto'}
                     >
                        <Icon fontSize={'xl'} transform={'translateY(1.5px)'}>
                           <BsSend />
                        </Icon>
                     </Button>
                  </Flex>{' '}
               </InputRightElement>
            </InputGroup>
         </Flex>
      </Flex>
   );
};

const SideBar = ({ newDocUploadHandle: newDocUploadHandle }: { newDocUploadHandle: UseDisclosureProp }) => {
   const [isUnder500] = useMediaQuery('(max-width: 500px)');

   return (
      <Flex
         height={'100%'}
         bg={'var(--grey-color)'}
         rounded={'xl'}
         // flex={1.2}
         width={'30%'}
         p={'1rem'}
         flexDir={'column'}
         gap={'0.5rem'}
      >
         <Heading fontSize={'xl'} fontWeight={'600'}>
            Documents
         </Heading>

         <InputGroup size={isUnder500 ? 'sm' : 'md'} colorScheme="gray">
            <Input
               pr="0.5rem"
               width={isUnder500 ? 'xs' : 'md'}
               placeholder="Search documents..."
               background={'var(--light-grey-color)'}
               border={'none'}
               _placeholder={{
                  color: 'var(--white-color)',
                  fontSize: '12px',
                  transform: 'translateY(-1px)'
               }}
            />
            <InputRightElement width="2.5rem">
               {' '}
               <SearchIcon />{' '}
            </InputRightElement>
         </InputGroup>

         <Flex
            width={'100%'}
            flexDir={'column'}
            minH={'50%'}
            maxH={'60%'}
            overflowY={'auto'}
            gap={'0.6rem'}
         >
            {new Array(10).fill('').map((_, idx) => {
               return (
                  <Flex
                     key={idx}
                     p={'1rem'}
                     bg={'var(--card-bg)'}
                     rounded={'xl'}
                     flexDir={'column'}
                     gap={'0.2rem'}
                  >
                     <Flex gap={'0.3rem'}>
                        <Text fontWeight={'600'} fontSize={'16px'}>
                           Service Agreement
                        </Text>
                        <Text ml={'auto'} fontWeight={'400'}>
                           PDF
                        </Text>
                     </Flex>
                     <Text fontWeight={'400'} fontSize={'13px'}>
                        This is the mandatory service agreement documents for all users
                     </Text>
                     <WhiteButton width={'8rem'} rounded={'xl'} fontSize={'14px'}>
                        Send Document
                     </WhiteButton>
                  </Flex>
               );
            })}
         </Flex>

         <OrangeButton onClick={newDocUploadHandle.onOpen}>Add New Document</OrangeButton>
      </Flex>
   );
};

const ChatMessage = ({ messagePos }: { messagePos: 'right' | 'left' }) => {
   const isRight = messagePos == 'right';
   const isLeft = messagePos == 'left';
   const [isUnder850] = useMediaQuery("(max-width: 850px)");
   const padding = isUnder850 ? '10%' : '40%';

   return (
      <Flex
         width={'100%'}
         py={'0.5rem'}
         pr={isLeft ? padding : '0%'}
         pl={isRight ? padding : '0%'}
         flexDir={isRight ? 'row-reverse' : 'row'}
      >
         <Flex height={'100%'} gap={'0.5rem'} flexDir={isRight ? 'row-reverse' : 'row'}>
            <Avatar></Avatar>

            <Flex flexDir={'column'} fontWeight={'400'} fontSize={'11px'} gap={'0.1rem'}>
               <Box
                  bg={isLeft ? 'var(--chat-left-msg-color)' : 'var(--orange-color)'}
                  rounded={'0.55rem'}
                  p={'0.5rem'}
               >
                  Lorem ipsumdolor sit amet, consectetur adipisicing elit. Cupiditate error a nemo
                  iste corporis tempore, recusandae perferendis repudiandae nulla doloremque. Iure
                  atque maiores rem, blanditiis eveniet nisi molestias praesentium! Error.
               </Box>
               <Text color={'var(--info-text-color)'} marginLeft={isRight ? 'auto' : 'initial'}>
                  May 22 @ 10:15 pm
               </Text>
            </Flex>
         </Flex>
      </Flex>
   );
};

import { ModalInput } from '../design/ModalWrapper';
import { MemberDocType } from '@/lib/firebase_docstype';
import DrawerWrapper from '../design/Drawer';

const NewDocumentUpload = ({ handler }: { handler: UseDisclosureProp }) => (
   <>
      <ModalWrapper {...handler}>
         <Flex alignItems={'center'} flexDir={'column'} color={'black'} gap={'1rem'}>
            <Heading fontSize={'20px'} fontWeight={'700'}>
               Upload New Document
            </Heading>
            <Flex flexDir={'column'} width={'100%'} gap={'0.5rem'}>
               <ModalInput labelValue="Document Name" placeholder="e.g. Service Agreement" />
               <ModalInput
                  labelValue="Description (Optional)"
                  isOptional={true}
                  placeholder="e.g. Mandatory for all customers"
               />
               {/* <ModalInput labelValue='Selected File'/>*/}
               <ModalDropDown
                  labelValue=""
                  menuTitle="Selected File"
                  menuItems={['XYZ', 'XYZ']}
                  onSelected={(s) => {}}
               />
            </Flex>
            <OrangeButton width={'100%'}>Upload Now</OrangeButton>
         </Flex>
      </ModalWrapper>
   </>
);

export default ChatRoom;
