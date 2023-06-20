import {
   Flex,
   Icon,
   Divider,
   Avatar,
   Text,
   Stack,
   Box,
   Center,
   useOutsideClick,
   Menu,
   MenuButton,
   MenuList,
   MenuItem,
   Button,
   useDisclosure
} from '@chakra-ui/react';
import { ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';

import { BiStats, BiUser, BiHelpCircle } from 'react-icons/bi';
import { RxDashboard } from 'react-icons/rx';
import { IoWalletOutline } from 'react-icons/io5';
import { FiSettings } from 'react-icons/fi';
import { BsShieldCheck } from 'react-icons/bs';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { ROUTING } from '@/util/constant';
import React, { useContext, useRef, useState } from 'react';
import CredentialsProvider from '@/lib/CredentialsProvider';
import { signOut } from 'firebase/auth';
import { firebase } from '@/lib/firebase';

interface SideBarLink {
   text: string;
   linkTo: (typeof ROUTING)[keyof typeof ROUTING];
   icon: React.ReactNode;
}

const sideBarLinks: Array<SideBarLink> = [
   { text: 'Dashboard', linkTo: ROUTING.home, icon: <RxDashboard /> },
   { text: 'Customers', linkTo: ROUTING.customers, icon: <BiStats /> },
   { text: 'Vehicles', linkTo: ROUTING.vehicles, icon: <IoWalletOutline /> },
   { text: 'Requests', linkTo: ROUTING.requests, icon: <BiUser /> },
   { text: 'Payments', linkTo: ROUTING.payments, icon: <FiSettings /> },
   { text: 'Waitlist', linkTo: ROUTING.waitList, icon: <FiSettings /> },
   // { text: 'Settings', linkTo: ROUTING.settings, icon: <BsShieldCheck /> },
   // { text: 'Help Centre', linkTo: ROUTING.helpCentre, icon: <BiHelpCircle /> }
];

export default function SideBar({ useMobStyle }: { useMobStyle: boolean }) {
   const router = useRouter();

   const [isOpen, setIsOpen] = useState<boolean>(false);
   const navBarRef = useRef<HTMLDivElement>(null);

   useOutsideClick({
      ref: navBarRef,
      handler: () => setIsOpen(false)
   });

   const [user, setUser] = useContext(CredentialsProvider);

   const matchRoutePath = (path: string) => {
      const matchingRoute = Object.values(ROUTING).find((route) => {
         const routeRegex = new RegExp(`^${route}(\/|$)`);
         return routeRegex.test(path);
      });
      return matchingRoute || '/';
   };

   return (
      <>
         {useMobStyle && <MobNavBar onOpen={() => setIsOpen(!isOpen)} />}
         <Flex
            ref={navBarRef}
            display={'flex'}
            minHeight={'100%'}
            bg={'white'}
            width={'20rem'}
            minW={'20rem'}
            background={'var(--dark-color)'}
            rounded={'2xl'}
            overflow={'auto'}
            flexDir={'column'}
            className={
               useMobStyle
                  ? `sticky-sidebar ${isOpen ? 'sticky-sidebar-open' : 'sticky-sidebar-close'}`
                  : ''
            }
         >
            <Link href={'/'}>
               <Flex flexDir={'column'} p={'2.3rem'}>
                  {/*eslint-disable-next-line @next/next/no-img-element */}
                  <img src={'/images/supercar-logo.png'} alt="company logo" loading="eager" />
               </Flex>
            </Link>

            {useMobStyle && (
               <Center
                  transform={'TranslateY(-1rem)'}
                  fontSize={'2rem'}
                  onClick={() => setIsOpen(false)}
               >
                  <HamburgerIcon />
               </Center>
            )}

            {/* icons */}
            <Flex flexDir={'column'} p={'2rem'} gap={'0.3rem'} pt={'0'}>
               {sideBarLinks.map((link, idx) => {
                  return (
                     <React.Fragment key={idx}>
                        <SideBarLinks
                           linkTo={link.linkTo}
                           isActive={matchRoutePath(router.asPath) == link.linkTo}
                           heading={link.text}
                           linkIcon={link.icon}
                           onClick={() => setIsOpen(false)}
                        />
                        {idx == 5 && (
                           <Divider marginTop={'0.2rem'} background={'var(--blue-color)'} />
                        )}
                     </React.Fragment>
                  );
               })}
            </Flex>

            <Flex p={'0.5rem'} px={'2rem'} alignItems={'center'} cursor={'pointer'} flex={1}>
               {!user ? (
                  <>
                     <Text color="red">Fail to load User Profile</Text>
                  </>
               ) : (
                  <>
                     <Avatar name={`${user.name} avatar`} src={user.photo || ''} />
                     <Stack gap={'0'} px={'0.6rem'} spacing={'-3px'}>
                        <Text fontSize={'xl'}>{user.name}</Text>
                        <Text px={'2px'}>{user.authenticated}</Text>
                     </Stack>
                     <ProfileDropDown />
                  </>
               )}
            </Flex>
         </Flex>
      </>
   );
}

const MobNavBar = ({ onOpen }: { onOpen: () => void }) => {
   return (
      <>
         <Flex width={'100%'} py="1rem" px={'1.5rem'} borderBottom="1px solid var(--grey-color)">
            <Link href={'/'}>
               <Box flexDir={'column'} p={'0.2rem'} display={'block'} width={'12rem'}>
                  {/*eslint-disable-next-line @next/next/no-img-element */}
                  <img src={'/images/supercar-logo.png'} alt="company logo" loading="eager" />
               </Box>
            </Link>

            <Box marginLeft={'auto'} onClick={onOpen}>
               <HamburgerIcon fontSize={'2rem'} transform={'TranslateY(0.2rem)'} />
            </Box>
         </Flex>
      </>
   );
};

const SideBarLinks = ({
   isActive,
   heading,
   linkIcon,
   linkTo,
   onClick
}: {
   isActive: boolean;
   heading: string;
   linkIcon: React.ReactNode;
   linkTo: string;
   onClick: () => void;
}) => {
   return (
      <>
         <Link href={linkTo}>
            <Flex
               onClick={onClick}
               bg={`${isActive ? 'var(--orange-color)' : ''}`}
               p={'1rem'}
               rounded={'xl'}
               cursor={'pointer'}
               gap={'0.5rem'}
            >
               <Icon fontSize={'2xl'}>{linkIcon}</Icon>
               {heading}
            </Flex>
         </Link>
      </>
   );
};

const ProfileDropDown = () => {
   const { isOpen, onOpen, onClose } = useDisclosure();

   return (
      <Menu>
         <MenuButton
            isActive={isOpen}
            as={Button}
            onClick={onOpen}
            color={'white'}
            p={'0'}
            bg={'transparent'}
            _hover={{ bg: 'transparent' }}
            _active={{ bg: 'transparent' }}
         >
            <ChevronDownIcon />
         </MenuButton>
         <MenuList bg={'var(--white-color)'} color={'black'}>
            <MenuItem
               _hover={{ bg: 'var(--orange-color)', color: 'var(--white-color)' }}
               bg={'var(--white-color)'}
               onClick={() => {
                  signOut(firebase.firebaseAuth);
               }}
            >
               Logout
            </MenuItem>
         </MenuList>
      </Menu>
   );
};
