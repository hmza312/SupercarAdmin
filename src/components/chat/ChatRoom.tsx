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
   useMediaQuery,
   useToast
} from '@chakra-ui/react';
import Link from 'next/link';
import OrangeButton from '../design/OrangeButton';
import { BsEmojiSmile, BsSend } from 'react-icons/bs';
import { ImAttachment } from 'react-icons/im';
import WhiteButton from '../design/WhiteButton';
import { useRouter } from 'next/router';
import { MutableRefObject, useContext, useEffect, useRef, useState } from 'react';
import {
   addDoc,
   collection,
   doc,
   getDoc,
   getDocs,
   onSnapshot,
   orderBy,
   query,
   setDoc,
   where
} from 'firebase/firestore';
import { agreementsColRef, conversationsColRef, firebase, membersColRef, uploadBlobToFirestore } from '@/lib/firebase';
import ModalWrapper, { ModalDropDown, ModalFileInput } from '../design/ModalWrapper';
import { UseDisclosureProp } from '@/types/UseDisclosureProp';
import { useCallback } from 'react';

const ChatRoom = () => {
   const router = useRouter();
   const [customer, setCustomer] = useState<MemberDocType | null>(null);
   const [isUnder850] = useMediaQuery('(max-width: 850px)');
   const [chatMessages, setChatMessages] = useState<Array<MessageDocType>>([]);
   const [user, setUser] = useContext(CredentialsProvider);
   const [convId, setConvId] = useState<string | null>(null);

   const [cleanUp, setCleanUp] = useState<() => void>(() => {});

   const subscribeSnapShots = (docId: string) => {
      const conversationDocRef = doc(conversationsColRef, docId);
      const messagesColRef = collection(conversationDocRef, 'Messages');

      const unSubSnapShot = onSnapshot(
         query(messagesColRef, orderBy('timestamp', 'asc')),
         (data) => {
            const messagesData = data.docs.map((doc) => {
               return {
                  ...doc.data(),
                  avatar: doc.data().sender == user?.uid ? user?.photo : customer?.photo
               } as MessageDocType;
            });

            setChatMessages(messagesData as Array<MessageDocType>);
         }
      );

      setCleanUp(() => unSubSnapShot);
   };

   useEffect(() => {
      const customerId = router.asPath.split('/').at(-1);

      const getConversations = async () => {
         const customerDocRef = doc(membersColRef, customerId);
         const customerDoc = await getDoc(customerDocRef);
         setCustomer({ ...customerDoc.data(), uid: customerDoc.id } as MemberDocType);

         const conversationQuery = query(
            conversationsColRef,
            where('recipient', '==', customerDoc.id)
         );

         const convDocs = (await getDocs(conversationQuery)).docs.map((d) => ({
            ...d.data(),
            id: d.id
         }));

         if (convDocs.length == 0) return; // no conversation so far

         setConvId(convDocs[0].id);
         subscribeSnapShots(convDocs[0].id);
      };

      getConversations();

      return () => {
         if (cleanUp) cleanUp();
      };
   }, []);

   const containerRef = useRef<any>(null);

   useEffect(() => {
      if (!containerRef) return;
      (containerRef.current as HTMLDivElement).scrollIntoView({ behavior: 'smooth' });
   }, [containerRef, chatMessages]);

   const { isOpen, onOpen, onClose } = useDisclosure();
   const sideBarHandle = useDisclosure();
   const toast = useToast();
   const [input, setInput] = useState<string>('');
   const [loading, setLoading] = useState<boolean>(false);

   const sendNewMessage = useCallback(async () => {
      if (input.length == 0) return;

      // user has no conversation create new one
      if (!convId) {
         setLoading(true);
         const customerId = router.asPath.split('/').at(-1);
         const conversationQuery = query(
            conversationsColRef,
            where('recipient', '==', customer?.uid || customerId)
         );

         const docsRef = (await getDocs(conversationQuery)).docs.map((d) => d.data());

         if (docsRef.length > 0) {
            setConvId(docsRef[0].id);
            return;
         }

         // create new conversation doc
         const newConvDoc = doc(conversationsColRef);
         await setDoc(newConvDoc, {
            description: '',
            id: newConvDoc.id,
            last_updated: localTimeStamp(),
            recipient: customer?.uid || customerId,
            status: 1
         } as ConversationDocType);

         setConvId(newConvDoc.id);

         const conversationDocRef = doc(conversationsColRef, newConvDoc.id);
         const messagesColRef = collection(conversationDocRef, 'Messages');
         const newMsgDoc = doc(messagesColRef);

         addDoc(messagesColRef, {
            contents: input,
            id: newMsgDoc.id,
            type: 1,
            timestamp: localTimeStamp(),
            sender: user?.uid
         } as MessageDocType);

         setInput('');
         // subscribe to snapshots
         subscribeSnapShots(newConvDoc.id);
         setLoading(false);
         return;
      }

      setLoading(true);
      const conversationDocRef = doc(conversationsColRef, convId);
      const messagesColRef = collection(conversationDocRef, 'Messages');

      const newMsgDoc = doc(messagesColRef);

      let isValid = user?.uid;

      if (!isValid) {
         toast({
            title: 'Message fail',
            description: 'Something Went Wrong!',
            status: 'error'
         });
         return;
      }

      addDoc(messagesColRef, {
         contents: input,
         id: newMsgDoc.id,
         type: 1,
         timestamp: localTimeStamp(),
         sender: user?.uid
      } as MessageDocType);

      setLoading(false);
      setInput('');
   }, [convId, user, toast, input]);

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
                  <ChatContainer
                     sendMessage={() => {
                        sendNewMessage();
                     }}
                     canSend={input.length != 0}
                     inputState={[input, setInput]}
                     chat={chatMessages}
                     containerRef={containerRef}
                     adminId={user?.uid as string}
                     loading={loading}
                  />
               </Flex>
               {isUnder850 ? (
                  <>
                     <DrawerWrapper isOpen={sideBarHandle.isOpen} onClose={sideBarHandle.onClose}>
                        <SideBar newDocUploadHandle={{ isOpen, onOpen, onClose }} />
                     </DrawerWrapper>
                  </>
               ) : (
                  <SideBar newDocUploadHandle={{ isOpen, onOpen, onClose }} />
               )}
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

const ChatContainer = ({
   chat,
   adminId,
   inputState,
   canSend,
   sendMessage,
   containerRef,
   loading
}: {
   containerRef: MutableRefObject<any>;
   canSend: boolean;
   chat: Array<MessageDocType>;
   adminId: string;
   inputState: UseStateProps<string>;
   sendMessage: () => void;
   loading: boolean;
}) => {
   const [isUnder500] = useMediaQuery('(max-width: 500px)');
   const [input, setInput] = inputState;

   return (
      <Flex
         height={'100%'}
         width={'100%'}
         bg={'var(--grey-color)'}
         overflowY={'auto'}
         p={'0.5rem'}
         rounded={'lg'}
         flexDir={'column'}
         gap={'0.5rem'}
      >
         {/* chat container */}
         <Flex flex={1} width={'100%'} overflowY={'auto'} maxH={'100%'} flexDir={'column'}>
            {chat.length == 0 && (
               <Center color={'var(--white-color)'}>No Conversation So far</Center>
            )}
            {chat.map((c, i) => {
               return (
                  <>
                     <ChatMessage
                        avatar={c.avatar as string}
                        key={i}
                        messagePos={c.sender == adminId ? 'right' : 'left'}
                        msg={c}
                     />

                     {c.multimedia &&
                        c.multimedia.map((multiMedia, idx) => (
                           <MultiMedia
                              avatar={c.avatar as string}
                              key={idx}
                              messagePos={c.sender == adminId ? 'right' : 'left'}
                              multimedia={multiMedia}
                           />
                        ))}
                  </>
               );
            })}

            <div ref={containerRef} style={{ marginBottom: '3rem' }}></div>
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
                  value={input}
                  onChange={(e) => {
                     setInput(e.target.value);
                  }}
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

                     {canSend && (
                        <Button
                           colorScheme="whatsapp"
                           rounded={'50%'}
                           minH={'37px'}
                           minW={'37px'}
                           maxH={'37px'}
                           maxW={'37px'}
                           marginLeft={'auto'}
                           onClick={sendMessage}
                           isLoading={loading}
                        >
                           <Icon fontSize={'xl'} transform={'translateY(1.5px)'}>
                              <BsSend />
                           </Icon>
                        </Button>
                     )}
                  </Flex>{' '}
               </InputRightElement>
            </InputGroup>
         </Flex>
      </Flex>
   );
};

const SideBar = ({
   newDocUploadHandle: newDocUploadHandle
}: {
   newDocUploadHandle: UseDisclosureProp;
}) => {
   const [isUnder500] = useMediaQuery('(max-width: 500px)');

   const [docs, setDocs] = useState<Array<AgreementDocType>>([]);
   const [input, setInput] = useState<string>('');

   useEffect(() => {
      onSnapshot(agreementsColRef, (data) => {
         setDocs(data.docs.map((doc) => doc.data()) as Array<AgreementDocType>);
      });
   }, []);

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
               value={input}
               onChange={(e) => {
                  setInput(e.target.value);
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
            {docs
               .filter((d) => d.title.toLocaleLowerCase().includes(input.toLocaleLowerCase()))
               .map((_doc, idx) => {
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
                              {_doc.title}
                           </Text>
                           <Text ml={'auto'} fontWeight={'400'}>
                              {_doc.extension}
                           </Text>
                        </Flex>
                        <Text fontWeight={'400'} fontSize={'13px'}>
                           {_doc.description}
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

const ChatMessage = ({
   messagePos,
   msg,
   avatar
}: {
   avatar: string | undefined;
   msg: MessageDocType;
   messagePos: 'right' | 'left';
}) => {
   const isRight = messagePos == 'right';
   const isLeft = messagePos == 'left';
   const [isUnder850] = useMediaQuery('(max-width: 850px)');
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
            <Avatar src={msg.avatar || ''} />

            <Flex flexDir={'column'} fontWeight={'400'} fontSize={'11px'} gap={'0.1rem'}>
               <Box
                  bg={isLeft ? 'var(--chat-left-msg-color)' : 'var(--orange-color)'}
                  rounded={'0.55rem'}
                  p={'0.5rem'}
               >
                  {msg.contents}
               </Box>
               <Text color={'var(--info-text-color)'} marginLeft={isRight ? 'auto' : 'initial'}>
                  {formatChatDate(new Date(msg.timestamp * 1000))}
               </Text>
            </Flex>
         </Flex>
      </Flex>
   );
};

import { FaCloudDownloadAlt } from "react-icons/fa";

const MultiMedia = ({
   messagePos,
   multimedia,
   avatar
}: {
   avatar: string | undefined;
   multimedia: MultiMediaDocType;
   messagePos: 'right' | 'left';
}) => {
   const isRight = messagePos == 'right';
   const isLeft = messagePos == 'left';
   const [isUnder850] = useMediaQuery('(max-width: 850px)');
   const padding = isUnder850 ? '10%' : '40%';

   const [loader, setLoader] = useState<boolean>(false);
   const [fileSize, setFileSize] = useState<string> ('');

   const [isUnder500] = useMediaQuery("(max-width: 500px)");

   useEffect(()=> {
      if (multimedia.type == "document")
      {
         setLoader(true);
         calculateFileSize(multimedia.url).then(size=> {
            setFileSize(`${size} mb`)
            setLoader(false);
         }).catch ((err)=> {
            setFileSize(`${multimedia.type}`)
            setLoader(false);
         });
      }
   }, [])

   return (
      <Flex
         width={'100%'}
         py={'0.5rem'}
         pr={isLeft ? padding : '0%'}
         pl={isRight ? padding : '0%'}
         flexDir={isRight ? 'row-reverse' : 'row'}
      >
         <Flex height={'100%'} gap={'0.5rem'} flexDir={isRight ? 'row-reverse' : 'row'}>
            <Avatar src={avatar || ''} />

            {multimedia.type == 'image' && (
               <Flex p={'0.5rem'} rounded={'lg'} flexDir={'column'} gap={'0.1rem'}>
                  <img
                     src={multimedia.url}
                     style={{ borderRadius: '0.5rem', maxWidth: (isUnder500 ? '250px' : '300px'), objectFit: 'contain' }}
                     alt={`${multimedia.title}`}
                  />
               </Flex>
            )}

            {multimedia.type == "document" && (
               <Flex p={'1.2rem'} rounded={'lg'} justifyContent={'center'} alignItems={'center'} gap={'1rem'} bg={'var(--orange-color)'}>
                  <Flex gap={'0.1rem'} flexDir={'column'}>
                     <Heading fontSize={'xl'} fontWeight={'600'}>{multimedia.title}</Heading>
                     {loader ? <Spinner /> : <Text fontWeight={'400'} fontSize={'md'}>{fileSize}</Text>}
                  </Flex>

                  <Icon fontSize={'2xl'} cursor={'pointer'}>
                   <a href={multimedia.url as string} target='_blank'>
                     <FaCloudDownloadAlt />
                   </a>
                  </Icon>
               </Flex>
            )}
            {/* <Flex flexDir={'column'} fontWeight={'400'} fontSize={'11px'} gap={'0.1rem'}>
                <Box
                   bg={isLeft ? 'var(--chat-left-msg-color)' : 'var(--orange-color)'}
                   rounded={'0.55rem'}
                   p={'0.5rem'}
                >
                   {msg.contents}
                </Box>
                <Text color={'var(--info-text-color)'} marginLeft={isRight ? 'auto' : 'initial'}>
                   {formatChatDate(new Date(msg.timestamp * 1000))}
                </Text>
             </Flex> */}
         </Flex>
      </Flex>
   );
};

import { ModalInput } from '../design/ModalWrapper';
import {
   AgreementDocType,
   ConversationDocType,
   MemberDocType,
   MessageDocType,
   MultiMediaDocType
} from '@/lib/firebase_docstype';
import DrawerWrapper from '../design/Drawer';
import CredentialsProvider from '@/lib/CredentialsProvider';
import { UseStateProps } from '@/types/UseStateProps';
import { calculateFileSize, formatChatDate, getFileNameAndExtension, localTimeStamp } from '@/util/helpers';
import { ValidateType } from '@/types/ValidateType';

const NewDocumentUpload = ({ handler }: { handler: UseDisclosureProp }) => {
   const [title, setTitle] = useState<ValidateType<string>>({ value: '', error: null });
   const [description, setDescription] = useState<ValidateType<string>>({ value: '', error: null });
   const [file, setFile] = useState<ValidateType<File | null>>({ value: null, error: null });

   const [loading, setLoading] = useState<boolean> (false);

   const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];

      if (selectedFile) {
         setFile({ value: selectedFile, error: null });
      }
   };

   const handleUpload = async () => {
      setTitle({ ...title, error: title.value.length > 0 ? null : 'Document name is empty' });
      setFile({ ...file, error: file.value ? null : 'select valid file' });

      if (title.value.length > 0 && file.value) {
         setLoading(true);
         const newDoc = doc(agreementsColRef);
         const blobFile = new Blob([file.value], { type: file.value.type });

         const fileName = file.value.name;
         const url = uploadBlobToFirestore(blobFile);

         setDoc(newDoc, {
            id: newDoc.id,
            filename: fileName.substring(0, fileName.lastIndexOf('.')),
            description: description.value,
            extension: fileName.split('.').pop(),
            title: title.value,
            url
         });

         setLoading(false);
         
         setTitle({ value: '', error: null });
         setDescription({ value: '', error: null });
         setFile({ value: null, error: null });
      }
   };

   return (
      <>
         <ModalWrapper {...handler}>
            <Flex alignItems={'center'} flexDir={'column'} color={'black'} gap={'1rem'}>
               <Heading fontSize={'20px'} fontWeight={'700'}>
                  Upload New Document
               </Heading>
               <Flex flexDir={'column'} width={'100%'} gap={'0.5rem'}>
                  <ModalInput
                     labelValue="Document Name"
                     placeholder="e.g. Service Agreement"
                     value={title.value}
                     error={title.error}
                     onChange={(e) => {
                        setTitle({ ...title, value: e.target.value });
                     }}
                  />
                  <ModalInput
                     labelValue="Description (Optional)"
                     isOptional={true}
                     placeholder="e.g. Mandatory for all customers"
                     value={description.value}
                     error={description.error}
                     onChange={(e) => {
                        setDescription({ ...description, value: e.target.value });
                     }}
                  />
                  {/* <ModalInput labelValue='Selected File'/>*/}
                  <ModalFileInput
                     labelValue="Select file"
                     type="file"
                     error={file.error}
                     onChange={handleFileInput}
                     accept=".doc, .docx, .pdf, .txt"
                  />
               </Flex>
               <OrangeButton width={'100%'} onClick={handleUpload} isLoading={loading}>
                  Upload Now
               </OrangeButton>
            </Flex>
         </ModalWrapper>
      </>
   );
};

export default ChatRoom;
