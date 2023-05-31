import {
   Flex,
   Heading,
   Input,
   InputGroup,
   Stack,
   Text,
   Avatar,
   Box,
   Center,
   Divider,
   useMediaQuery
} from '@chakra-ui/react';
import ContentHeader from './design/ContentHeader';
import WhiteButton from './design/WhiteButton';
import OrangeButton from './design/OrangeButton';
import { useDocsCount } from '@/lib/hooks/useDocsCount';
import { callsColRef, membersColRef, vehiclesColRef } from '@/lib/firebase';
import { useEffect, useRef, useState } from 'react';
import { getDocs } from 'firebase/firestore';
import { MemberDocType, RequestDocType } from '@/lib/firebase_docstype';
import Pagination from './design/Pagination';
import { usePaginator } from 'chakra-paginator';
import usePagination from '@/lib/hooks/usePagination';

const pageQt = 15;

export default function RequestsContent() {
   const [requestsCount] = useDocsCount(callsColRef);
   const [requests, setRequests] = useState<Array<RequestDocType>>([]);

   useEffect(() => {
      const fetchRequests = async () => {
         const requestDocs = await getDocs(callsColRef);
         const users = (await getDocs(membersColRef)).docs.map((d) => ({
            ...d.data(),
            uid: d.id
         })) as Array<MemberDocType>;

         setRequests(
            (requestDocs.docs.map((d) => d.data()) as Array<RequestDocType>).map((d) => {
               return { ...d, user_data: users.filter((u) => u.uid == d.user)[0] };
            })
         );
      };

      fetchRequests();
   }, []);

   const [requestsToShow, paginationIndices, setActiveIdx] = usePagination<RequestDocType>(
      requests,
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

   return (
      <Flex width="100%" flexDir="column" gap="1rem" height="100%" ref={topRef}>
         <ContentHeader
            description="Use the chatroom to discuss payments and other client relations"
            heading={`Help Requests (${requestsCount})`}
         />
         <Flex gap="0.3rem">
            <CustomersList
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
   );
}

const CustomersList = ({
   requests,
   pageCounts,
   handlePageChange
}: {
   requests: Array<RequestDocType>;
   pageCounts: number;
   handlePageChange: (page: number) => void;
}) => {
   const [isUnder650] = useMediaQuery('(max-width: 650px)');

   return (
      <Flex
         flex={3}
         width={'100%'}
         height={'100vh'}
         maxH={'100vh'}
         minHeight={'100vh'}
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
               return <CustomerData key={idx} request={req} />;
            })}
         </Flex>
         <Flex flexBasis={'17%'} alignSelf={'flex-end'}>
            <Box>
               <Pagination pageCounts={pageCounts} handlePageChange={handlePageChange} />
            </Box>
         </Flex>
      </Flex>
   );
};

const CustomerData = ({ request }: { request: RequestDocType }) => {
   const [isUnder650] = useMediaQuery('(max-width: 650px)');

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
            <Avatar size="md" name="Kent Dodds" src={request.user_data.photo} />
         )}

         {!request.user_data && <Avatar size={'md'} border={'1px solid white'} showBorder={true} />}

         <Stack spacing={0}>
            <Text fontSize="lg" whiteSpace="nowrap">
               {request.user_name}
            </Text>
            <Text fontSize="xs" whiteSpace="nowrap">
               {request.user_mobile}
            </Text>
         </Stack>

         <Flex gap="1rem" marginLeft="auto">
            <OrangeButton>Message</OrangeButton>
            <WhiteButton>Other</WhiteButton>
            <WhiteButton>Close</WhiteButton>
         </Flex>
      </Flex>
   );
};
