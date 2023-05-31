import { membersColRef, vehiclesColRef } from '@/lib/firebase';
import { getDocs } from 'firebase/firestore';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import DrawerWrapper from './design/Drawer';

import {
   Box,
   Text,
   Flex,
   Badge,
   Link,
   Heading,
   useMediaQuery,
   useDisclosure
} from '@chakra-ui/react';
import ContentHeader from './design/ContentHeader';
import WhiteButton from './design/WhiteButton';

import { usePaginator } from 'chakra-paginator';

const pageQt = 15;

export default function Vehicles() {
   useEffect(() => {
      const fetchDocs = async () => {
         const res = await getDocs(vehiclesColRef);
         const users = (await getDocs(membersColRef)).docs.map((d) => ({
            ...d.data(),
            uid: d.id
         })) as Array<MemberDocType>;

         const docs = (res.docs.map((doc) => doc.data()) as Array<VehicleDocType>).map((d) => ({
            ...d,
            owner_data: users.filter((u) => u.uid == d.owner)[0]
         }));
         setVehicles(docs);
      };

      fetchDocs();
   }, []);

   const [vehicles, setVehicles] = useState<Array<VehicleDocType>>([]);
   const [vehicleCount] = useDocsCount(vehiclesColRef);
   const [selectedVehicle, setSelectedVehicle] = useState<VehicleDocType | null>(null);

   
   const [isUnder850] = useMediaQuery('(max-width: 850px)');
   const { isOpen, onOpen, onClose } = useDisclosure();
   
   const [vehiclesToShow, paginationIndices, setActiveIdx] = usePagination
   <VehicleDocType>(
      vehicles,
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
      <>
         <Flex width="100%" flexDir="column" gap="1rem" height="100%" ref={topRef}>
            <ContentHeader
               description="Catalog of all vehicles available in you automation fleet"
               heading={`Vehicles (${vehicleCount})`}
            />
            <Flex gap={'0.1rem'}>
               <VehiclesList
                  vehicles={vehiclesToShow}
                  onSelect={setSelectedVehicle}
                  onDrawerOpen={onOpen}
                  handlePageChange={(i) => {
                     setActiveIdx(i);
                     (topRef.current as HTMLElement)?.scrollIntoView({
                        behavior: "smooth"
                     });
                  }}
                  pageCounts={paginationIndices.length}
               />
               {!isUnder850 ? (
                  <VehicleDetail vehicle={selectedVehicle} />
               ) : (
                  <DrawerWrapper isOpen={isOpen} onClose={onClose}>
                     <VehicleDetail vehicle={selectedVehicle} />
                  </DrawerWrapper>
               )}
            </Flex>
         </Flex>
      </>
   );
}

const VehicleDetail = ({ vehicle }: { vehicle: VehicleDocType | null }) => {
   const [isUnder850] = useMediaQuery('(max-width: 850px)');

   if (vehicle == null) return <></>;

   return (
      <Flex
         flex={1}
         bg={isUnder850 ? 'var(--bg-color)' : 'var(--grey-color)'}
         rounded="lg"
         height={'auto'}
         padding={'0.5rem'}
         flexDir={'column'}
         gap={'1rem'}
         overflowY={'auto'}
      >
         <Heading fontSize={'xl'}>Vehicles</Heading>

         <img
            width={'100%'}
            height={'auto'}
            src={vehicle.thumbnail}
            style={{ borderRadius: '0.5rem', maxHeight: '20rem' }}
         />
         <Flex alignItems={'center'} flexDir={'column'} justifyContent={'center'} gap={'0.5rem'}>
            <Heading textAlign={'center'} fontSize={'2xl'}>
               {vehicle.title}
            </Heading>
            {vehicle.owner_data ? (
               <>
                  <Text>{vehicle.owner_data.name ?? 'unknown'}</Text>
                  <Text>{vehicle.owner_data.mobile ?? ''}</Text>
               </>
            ) : (
               <>
                  <Text>{'Unknown'}</Text>
               </>
            )}
         </Flex>
         <Flex gap={'1rem'} justifyContent={'center'} flexWrap={'wrap'}>
            <OrangeButton display={'block'}>Add Payment</OrangeButton>
            <WhiteButton display={'block'}>Edit</WhiteButton>
         </Flex>
      </Flex>
   );
};

const VehiclesList = ({
   vehicles,
   onSelect,
   onDrawerOpen,
   handlePageChange,
   pageCounts
}: {
   vehicles: Array<any>;
   onSelect: Dispatch<SetStateAction<VehicleDocType | null>>;
   onDrawerOpen: () => void;
   handlePageChange: (page: number) => void;
   pageCounts: number;
}) => {
   const [isUnder850] = useMediaQuery('(max-width: 850px)');

   return (
      <>
         <Flex
            flex={isUnder850 ? 1 : 3}
            width={'100%'}
            height={'100vh'}
            maxH={'100vh'}
            minHeight={'100vh'}
            flexDir={'column'}
            gap={'1rem'}
            py={0}
         >
            <Flex
               flexWrap={'wrap'}
               gap={'0.5rem'}
               overflowY={'auto'}
               flexBasis={'100%'}
               justifyContent={'center'}
               width={'100%'}
            >
               {vehicles.map((vehicle, idx) => {
                  return (
                     <VehicleData
                        vehicle={vehicle}
                        key={idx}
                        onClick={() => {
                           onSelect(vehicle);
                           onDrawerOpen();
                        }}
                     />
                  );
               })}
            </Flex>
            <Flex flexBasis={'17%'} alignSelf={'flex-end'}>
               <Pagination pageCounts={pageCounts} handlePageChange={handlePageChange}/>
            </Flex>
         </Flex>
      </>
   );
};

import { Image } from '@chakra-ui/next-js';
import { MemberDocType, VehicleDocType } from '@/lib/firebase_docstype';
import { useDocsCount } from '@/lib/hooks/useDocsCount';
import usePagination from '@/lib/hooks/usePagination';
import OrangeButton from './design/OrangeButton';
import { paginatorStyle } from '@/styles/Style';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import Pagination from './design/Pagination';

const VehicleData = ({ vehicle, onClick }: { vehicle: VehicleDocType; onClick: () => void }) => {
   return (
      <>
         {/*eslint-disable-next-line @next/next/no-img-element */}
         <Box
            rounded={'lg'}
            pb={'1rem'}
            bg={'var(--grey-color)'}
            cursor={'pointer'}
            onClick={onClick}
         >
            <Image
               src={vehicle.thumbnail}
               alt="vehicle_image"
               height={180}
               width={280}
               quality={100}
               borderRadius={'var(--chakra-radii-lg)'}
               style={{ objectFit: 'fill' }}
            />
            <Flex p={'0.3rem'} flexDir={'column'}>
               <Heading fontSize={'md'}>{vehicle.title}</Heading>
               <Text fontWeight={'light'} fontSize={'sm'}>
                  {vehicle.owner_data ? vehicle.owner_data.name ?? 'Unknown' : 'Unknown'}
               </Text>
            </Flex>
         </Box>
      </>
   );
};
