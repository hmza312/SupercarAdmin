import { MemberDocType } from '@/lib/firebase_docstype';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const WaitListPayment = ({ user }: { user: MemberDocType }) => {
   return (
      <>
         <Flex
            background={'var(--card-bg)'}
            rounded={'md'}
            p={'1rem'}
            flexDir={'column'}
            gap={'0.5rem'}
         >
            <Flex width={'100%'}>
               <Heading fontSize={'lg'}>{`${user.name || 'Unknown'}`.slice(0, 24)}</Heading>
               <Text fontSize={'sm'} marginLeft={'auto'}>{`${new Date(
                  user.joined * 1000
               ).toDateString()}`}</Text>
            </Flex>
            <Box justifySelf={'flex-start'}>
               <Button background={'white'} color={'black'} size={'sm'}>
                  View Application
               </Button>
            </Box>
         </Flex>
      </>
   );
};

const WaitList = (
   { useMobStyle, users }: { users: MemberDocType[]; useMobStyle?: boolean } = {
      users: [],
      useMobStyle: false
   }
) => {
   const [waitListedUser, setWaitListedUsers] = useState<MemberDocType[]>([]);
   const [waitListedUserCount, setWaitListedUsersCount] = useState<number>(0);

   useEffect(() => {
      setWaitListedUsers(
         users.filter((u) => {
            return u.permitted == null && !u.deleted;
         })
      );
      setWaitListedUsersCount(
         users.filter((u) => {
            return u.permitted == null && !u.deleted;
         }).length
      );
   }, [users]);

   return (
      <Flex flexDir={'column'} width={'100%'} height={'100%'} gap={'1rem'} p={'1rem'}>
         <Heading fontSize={'2xl'}>Waitlist</Heading>

         <Box flexDir={'column'}>
            <Text>Pending Users</Text>
            <Text>{waitListedUserCount}</Text>
         </Box>

         <Flex
            overflowY={'scroll'}
            flex={1}
            flexDir={'column'}
            gap={'0.5rem'}
            maxH={useMobStyle ? '20rem' : 'initial'}
         >
            {waitListedUser.map((user, idx) => {
               return <WaitListPayment user={user} key={idx} />;
            })}
         </Flex>

         <Button
            color={'black'}
            background={'var(--white-color)'}
            _hover={{ background: 'var(--white-color)' }}
         >
            See Full User Waitlist
         </Button>
      </Flex>
   );
};

export default WaitList;
