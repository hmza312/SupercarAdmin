import { membersColRef, vehiclesColRef } from '@/lib/firebase';
import { getDocs } from 'firebase/firestore';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import DrawerWrapper from './design/Drawer';

import {
   Box,
   Text,
   Flex,
   Heading,
   useMediaQuery,
   useDisclosure,
   Center,
   Divider,
   Select
} from '@chakra-ui/react';
import ContentHeader from './design/ContentHeader';
import WhiteButton from './design/WhiteButton';

import { usePaginator } from 'chakra-paginator';

const pageQt = 15;

export default function Vehicles() {
   const fetchVehicles = async () => {
      const res = await getDocs(vehiclesColRef);
      const users = (await getDocs(membersColRef)).docs.map((d) => ({
         ...d.data(),
         uid: d.id
      })) as Array<MemberDocType>;
      setFilter({
         ...filter,
         customers: users.filter((user, idx, self) => {
            return self.findIndex((val) => val.name == user.name) == idx;
         })
      });
      const docs = (res.docs.map((doc) => doc.data()) as Array<VehicleDocType>).map((d) => ({
         ...d,
         owner_data: users.filter((u) => u.uid == d.owner)[0]
      }));
      setVehicles(docs);
   };

   useEffect(() => {
      fetchVehicles();
   }, []);

   const [vehicles, setVehicles] = useState<Array<VehicleDocType>>([]);
   const [vehicleCount] = useDocsCount(vehiclesColRef);
   const [selectedVehicle, setSelectedVehicle] = useState<VehicleDocType | null>(null);

   const [filter, setFilter] = useState<VehiclesFilter>({
      customers: [],
      input: '',
      selectedCustomer: null
   });

   const [isUnder850] = useMediaQuery('(max-width: 850px)');
   const [isUnder1350] = useMediaQuery('(max-width: 1350px)');
   const [isUpper1100] = useMediaQuery('(min-width: 1350px');

   const { isOpen, onOpen, onClose } = useDisclosure();

   const [vehiclesToShow, paginationIndices, setActiveIdx] = usePagination<VehicleDocType>(
      vehicles.filter((v) => {
         if (!filter.selectedCustomer) return true;
         return v.owner_data && v.owner_data.name == filter.selectedCustomer;
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

   return (
      <>
         <Flex width="100%" flexDir="column" gap="1rem" height="100%" ref={topRef} >
            <ContentHeader
               description="Catalog of all vehicles available in you automation fleet"
               heading={`Vehicles (${vehicleCount})`}
               value={filter.input}
               onChange={(e) => setFilter({ ...filter, input: e.target.value })}
            />
            <Flex gap={'0.1rem'}>
               <VehiclesList
                  vehicles={vehiclesToShow}
                  onSelect={setSelectedVehicle}
                  onDrawerOpen={onOpen}
                  handlePageChange={(i) => {
                     setActiveIdx(i);
                     (topRef.current as HTMLElement)?.scrollIntoView({
                        behavior: 'smooth'
                     });
                  }}
                  onSubmitFinish={() => {
                     fetchVehicles();
                  }}
                  pageCounts={paginationIndices.length}
                  filterState={[filter, setFilter]}
               />
               {!isUnder850 && !(isUpper1100 && isUnder1350) ? (
                  <VehicleDetail vehicle={selectedVehicle} renderInDrawer={false} />
               ) : (
                  <DrawerWrapper isOpen={isOpen} onClose={onClose}>
                     <VehicleDetail vehicle={selectedVehicle} renderInDrawer={true} />
                  </DrawerWrapper>
               )}
            </Flex>
         </Flex>
      </>
   );
}

const VehicleDetail = ({
   vehicle,
   renderInDrawer
}: {
   vehicle: VehicleDocType | null;
   renderInDrawer: boolean;
}) => {
   if (vehicle == null) return <></>;

   return (
      <Flex
         flex={1.3}
         bg={renderInDrawer ? 'var(--bg-color)' : 'var(--grey-color)'}
         rounded="lg"
         height={'100%'}
         flexDir={'column'}
         gap={'1rem'}
         overflowY={'auto'}
         mb={renderInDrawer ? '2rem' : 'initial'}
      >
         <Flex p={'1rem'} pb={'0rem'}>
            <Heading fontSize={'xl'}>Vehicle Info</Heading>
         </Flex>
         <img
            width={'100%'}
            height={'auto'}
            src={vehicle.thumbnail}
            style={{ maxHeight: '20rem' }}
         />
         <Flex alignItems={'center'} flexDir={'column'} justifyContent={'center'} gap={'0.1rem'}>
            <Heading textAlign={'center'} fontSize={'2xl'}>
               {vehicle.year} {vehicle.title}
            </Heading>
            {vehicle.owner_data ? (
               <>
                  <Text>Owned by {vehicle.owner_data.name ?? 'unknown'}</Text>
                  <Text>{vehicle.owner_data.mobile ?? ''}</Text>
               </>
            ) : (
               <>
                  <Text>{'Unknown'}</Text>
               </>
            )}
         </Flex>

         <Flex flexDir={'column'} justifyContent={'center'} alignContent={'center'}>
            <Center>
               <Text fontWeight={'500'}>{'Vehicle Model'}</Text>
            </Center>
            <Center>
               <Text>{vehicle.model}</Text>
            </Center>
            <Center px={'25%'} py={'0.2rem'}>
               <Divider borderColor={'var(--white-color)'} borderWidth={'1px'} />
            </Center>

            <Center>
               <Text fontWeight={'500'}>{'Brand'}</Text>
            </Center>
            <Center>
               <Text>{vehicle.make}</Text>
            </Center>
            <Center px={'25%'} py={'0.2rem'}>
               <Divider borderColor={'var(--white-color)'} borderWidth={'1px'} />
            </Center>

            <Center>
               <Text fontWeight={'500'}>{'Mileage'}</Text>
            </Center>
            <Center>
               <Text>{5624}</Text>
            </Center>
            <Center px={'25%'} py={'0.2rem'}>
               <Divider borderColor={'var(--white-color)'} borderWidth={'1px'} />
            </Center>
         </Flex>

         <Flex gap={'1rem'} justifyContent={'center'} flexWrap={'wrap'} p={'0.3rem'}>
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
   pageCounts,
   filterState,
   onSubmitFinish
}: {
   vehicles: Array<any>;
   onSelect: Dispatch<SetStateAction<VehicleDocType | null>>;
   onDrawerOpen: () => void;
   handlePageChange: (page: number) => void;
   pageCounts: number;
   filterState: UseStateProps<VehiclesFilter>;
   onSubmitFinish: () => void;
}) => {
   const [isUnder850] = useMediaQuery('(max-width: 850px)');
   const [filter, setFilter] = filterState;

   const { onClose, onOpen, isOpen } = useDisclosure();

   return (
      <>
         <Flex
            flex={isUnder850 ? 1 : 3}
            width={'100%'}
            height={'80vh'}
            maxH={'90vh'}
            minHeight={'86vh'}
            flexDir={'column'}
            gap={'0rem'}
            py={0}
         >
            <Flex p={'0.5rem'} gap={'1rem'}>
               <DropDown
                  menuTitle={filter.selectedCustomer ? filter.selectedCustomer : 'Select Customers'}
                  menuitems={filter.customers.map((c) => c.name).sort()}
                  onSelected={(item) => {
                     setFilter({ ...filter, selectedCustomer: item });
                  }}
               />
               <OrangeButton
                  marginLeft={'auto'}
                  onClick={() => {
                     onOpen();
                  }}
               >
                  Add New Vehicle
               </OrangeButton>
               <VehicleUploadForm
                  customers={filter.customers}
                  handler={{ onClose, onOpen, isOpen }}
                  onFinishSubmit={() => {}}
               />
            </Flex>
            <Flex
               flexWrap={'wrap'}
               gap={'0.5rem'}
               columnGap={'0.5rem'}
               overflowY={'auto'}
               flexBasis={'100%'}
               justifyContent={'center'}
               width={'100%'}
            >
               {vehicles.map((vehicle, idx) => {
                  return (
                     <>
                        <VehicleData
                           vehicle={vehicle}
                           key={idx}
                           onClick={() => {
                              onSelect(vehicle);
                              onDrawerOpen();
                           }}
                        />
                     </>
                  );
               })}
            </Flex>
            <Flex alignSelf={'flex-end'} px={'0.5rem'} >
               <Box p={'0.5rem'}>
                  <Pagination pageCounts={pageCounts} handlePageChange={handlePageChange} />
               </Box>
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
import Pagination from './design/Pagination';
import DropDown from './design/DropDown';
import { VehiclesFilter } from './types/VehiclesTypes';
import { UseStateProps } from '@/types/UseStateProps';
import VehicleUploadForm from './form/VehicleUploadForm';

const VehicleData = ({ vehicle, onClick }: { vehicle: VehicleDocType; onClick: () => void }) => {
   const [isUnder500] = useMediaQuery('(max-width: 500px)');

   return (
      <>
         {/*eslint-disable-next-line @next/next/no-img-element */}
         <Box
            minH={'261px'}
            minW={isUnder500 ? '100%' : '359px'}
            maxH={'262px'}
            maxW={'359px'}
            rounded={'lg'}
            pb={'1rem'}
            bg={'var(--grey-color)'}
            cursor={'pointer'}
            onClick={onClick}
         >
            <Image
               src={vehicle.thumbnail}
               alt="vehicle_image"
               maxWidth={'359.236px'}
               minW={isUnder500 ? '100%' : '359.236px'}
               minH={'191px'}
               maxH={'191px'}
               height={191}
               width={359}
               quality={100}
               borderTopRadius={'10px'}
               style={{ objectFit: 'cover' }}
            />
            <Flex p={'17px'} pt={'13px'} flexDir={'column'}>
               <Heading fontSize={'17px'} fontWeight={'600'}>
                  {vehicle.year} {vehicle.title}
               </Heading>
               <Text fontWeight={'light'} fontSize={'sm'}>
                  {vehicle.owner_data ? vehicle.owner_data.name ?? 'Unknown' : 'Unknown'}
               </Text>
            </Flex>
         </Box>
      </>
   );
};
