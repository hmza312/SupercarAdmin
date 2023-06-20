import {
   Flex,
   Stack,
   Text,
   Avatar,
   Box,
   useMediaQuery,
   useDisclosure,
   useToast
} from '@chakra-ui/react';
import ContentHeader from './design/ContentHeader';
import WhiteButton from './design/WhiteButton';
import OrangeButton from './design/OrangeButton';
import { useDocsCount } from '@/lib/hooks/useDocsCount';
import { callsColRef, membersColRef, paymentsColRef, vehiclesColRef } from '@/lib/firebase';
import { useEffect, useRef, useState } from 'react';
import { doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { MemberDocType, RequestDocType } from '@/lib/firebase_docstype';
import Pagination from './design/Pagination';
import { usePaginator } from 'chakra-paginator';
import usePagination from '@/lib/hooks/usePagination';
import { ROUTING } from '@/util/constant';
import Link from 'next/link';
import ConfirmModal from './design/ConfirmModal';
import { UseDisclosureProp } from '@/types/UseDisclosureProp';
import { ScheduleMeetingModal } from './form/ScheduleMeetingModal';
import DropDown from './design/DropDown';

const pageQt = 15;

interface RequestStatus {
   title: string;
   status: number;
}

const paymentStatus: Array<RequestStatus> = [
   { title: 'Requested', status: 0 },
   { title: 'confirmed', status: 1 },
   { title: 'Completed', status: 2 },
   { title: 'Cancelled', status: 3 },
   { title: 'Reset', status: 4 }
];

export default function RequestsContent() {
   const [requestsCount] = useDocsCount(callsColRef);
   const [requests, setRequests] = useState<Array<RequestDocType>>([]);
   const [selectedStatus, setSelectedStatus] = useState<RequestStatus | null>(null);

   useEffect(() => {
      const fetchRequests = async () => {
         const requestDocs = await getDocs(callsColRef);
         const users = (await getDocs(membersColRef)).docs.map((d) => ({
            ...d.data(),
            uid: d.id
         })) as Array<MemberDocType>;

         setRequests(
            (requestDocs.docs.map((d) => d.data()) as Array<RequestDocType>).map((d) => {
               return { ...d, user_data: users.filter((u) => u.uid == d.user)[0], id: d.id };
            })
         );
      };

      fetchRequests();
   }, []);

   const [requestsToShow, paginationIndices, setActiveIdx] = usePagination<RequestDocType>(
      requests.filter((r) => {
         return selectedStatus == null
            ? r.status == 0 || r.status == 1
            : r.status == selectedStatus.status;
      }),
      pageQt
   );

   const { currentPage, setCurrentPage } = usePaginator({
      total: paginationIndices.length,
      initialState: {
         pageSize: pageQt,
         currentPage: 1
      }
   });
   
   const topRef = useRef<any>(null);
   const { isOpen, onOpen, onClose } = useDisclosure();

   return (
      <>
         <Flex width="100%" flexDir="column" gap="0.5rem" height="100%" ref={topRef}>
            <ContentHeader
               description="Use the chatroom to discuss payments and other client relations"
               heading={`Help Requests (${
                  requests.filter((r) => {
                     return selectedStatus == null
                        ? r.status == 0 || r.status == 1
                        : r.status == selectedStatus.status;
                  }).length
               })`}
            />
            <Flex gap={'1rem'} width={'100%'} pb={'0.2rem'}>
               <Box ml={'auto'}>
                  <DropDown
                     menuTitle={
                        selectedStatus == null ? 'Select Request Status' : selectedStatus.title
                     }
                     menuitems={paymentStatus.map((p) => p.title)}
                     onSelected={(item) => {
                        if (item === 'all') setSelectedStatus(null);
                        else setSelectedStatus(paymentStatus.filter((p) => p.title == item)[0]);
                     }}
                  />
               </Box>
            </Flex>
            <Flex gap="0.3rem">
               <CustomersList
                  handleModal={{ isOpen, onOpen, onClose }}
                  requests={requestsToShow}
                  pageCounts={paginationIndices.length}
                  handlePageChange={(i) => {
                     setActiveIdx(i);
                     (topRef.current as HTMLElement)?.scrollIntoView({
                        behavior: 'smooth'
                     });
                  }}
               />
               {/* <Flex
          flex={1}
          bg="var(--grey-color)"
          rounded="lg"
          height={"auto"}
          justifyContent={"center"}
          padding={"1rem"}
        >
          <Flex
            py={"2rem"}
            flexDir={"column"}
            alignContent={"center"}
            gap={"1rem"}
          >
            <Center>
              <Avatar
                size="xl"
                name="Kent Dodds"
                src="https://bit.ly/kent-c-dodds"
              />
            </Center>
            <Center flexDir={"column"}>
              <Heading fontSize={"xl"}>Kent C Dodds</Heading>
              <Text fontSize={"sm"}>Owner at Corsa Auto Rentals</Text>
            </Center>

            <Divider color={"white"} />

            <Center flexDir={"column"}>
              <Heading fontSize={"xl"}>Email Address</Heading>
              <Text fontSize={"md"}>ethan@ethanduran.com</Text>
            </Center>

            <Center gap={"1rem"} flexWrap={"wrap"}>
              <WhiteButton>Message</WhiteButton>
              <WhiteButton>Edit</WhiteButton>
              <WhiteButton>Documents</WhiteButton>
            </Center>
          </Flex>
        </Flex> */}
            </Flex>
         </Flex>
      </>
   );
}

const CustomersList = ({
   requests,
   pageCounts,
   handlePageChange,
   handleModal
}: {
   requests: Array<RequestDocType>;
   pageCounts: number;
   handlePageChange: (page: number) => void;
   handleModal: UseDisclosureProp;
}) => {
   const [isUnder650] = useMediaQuery('(max-width: 650px)');

   return (
      <Flex
         flex={3}
         width={'100%'}
         height={'80vh'}
         minHeight={'80vh'}
         flexDir={'column'}
         gap={'1rem'}
         p={isUnder650 ? '0.5rem' : '1rem'}
         py={0}
         pb={'0rem'}
      >
         <Flex
            flexDir={'column'}
            gap={'1rem'}
            overflowY={isUnder650 ? 'initial' : 'auto'}
            flexBasis={isUnder650 ? '100%' : '90%'}
         >
            {requests.map((req, idx) => {
               return (
                  <>
                     <ScheduleMeetingModal
                        docId={req.id}
                        userName={req.user_data?.name || ''}
                        userId={req.user_data?.uid || ''}
                        handler={handleModal}
                     />
                     <CustomerData key={idx} request={req} modalHandle={handleModal} />
                  </>
               );
            })}
         </Flex>
         <Flex alignSelf={'flex-end'}>
            <Box p = {'0.5rem'}>
               <Pagination pageCounts={pageCounts} handlePageChange={handlePageChange} />
            </Box>
         </Flex>
      </Flex>
   );
};

const CustomerData = ({
   request,
   modalHandle
}: {
   request: RequestDocType;
   modalHandle: UseDisclosureProp;
}) => {
   const [isUnder650] = useMediaQuery('(max-width: 650px)');

   const cancelModalHandler = useDisclosure();
   const toast = useToast();

   return (
      <Flex
         background="var(--grey-color)"
         padding="1rem"
         gap="1.5rem"
         flexDir="row"
         rounded="lg"
         minH={isUnder650 ? '5rem' : 'initial'}
         overflowX={isUnder650 ? 'auto' : 'initial'}
      >
         {request.user_data && request.user_data.photo && (
            <Avatar size="md" name={`${request.user_data.name}`} src={request.user_data.photo} />
         )}

         {!request.user_data && <Avatar size={'md'} border={'1px solid white'} showBorder={true} />}

         <Stack spacing={0}>
            <Text fontSize="lg" whiteSpace="nowrap">
               {request.user_data ? request.user_data.name : request.user_name || 'Unknown'}
            </Text>
            <Text fontSize="xs" whiteSpace="nowrap">
               {request.user_data ? request.user_data.mobile : request.user_mobile}
            </Text>
         </Stack>

         {/* Modal */}

         <ConfirmModal
            handle={cancelModalHandler}
            title="Close Request"
            question={`Are you sure to cancel '${
               request.user_data ? request.user_data.name : request.user_name || 'Unknown'
            }' request? `}
            onConfirm={() => {
               const paymentDocRef = doc(callsColRef, request.id);
               updateDoc(paymentDocRef, { status: 3 })
                  .then(() => {
                     toast({
                        title: `Request has been canceled`,
                        status: 'success',
                        isClosable: true
                     });
                  })
                  .catch((e) => {
                     toast({
                        title: `Something Went Gone Please,Try Again`,
                        status: 'error',
                        isClosable: true
                     });
                  });
            }}
         />

         <Flex gap="1rem" marginLeft="auto">
            <Link href={`${ROUTING.customers}/chat/${request.user_data?.uid}`}>
               <OrangeButton>Message</OrangeButton>
            </Link>
            <WhiteButton onClick={modalHandle.onOpen}>Other</WhiteButton>
            <WhiteButton onClick={cancelModalHandler.onOpen}>Close</WhiteButton>
         </Flex>
      </Flex>
   );
};
