import { membersColRef } from "@/lib/firebase";
import { FieldValue, deleteField, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

import { MemberDocType } from "@/lib/firebase_docstype";
import { Avatar, Box, Flex, Text, Stack, useDisclosure, useMediaQuery, useToast, Link } from "@chakra-ui/react";
import ContentHeader from "./design/ContentHeader";
import usePagination from "@/lib/hooks/usePagination";
import { UseDisclosureProp } from "@/types/UseDisclosureProp";
import Pagination from "./design/Pagination";
import OrangeButton from "./design/OrangeButton";
import WhiteButton from "./design/WhiteButton";
import { ROUTING } from "@/util/constant";
import ConfirmModal from "./design/ConfirmModal";

const pageQt = 15;

export default function WaitList ()
{
    const [users, setUsers] = useState<Array<MemberDocType>>([]);

    useEffect(()=> {    

        getDocs(membersColRef).then(snapShot=> {
            setUsers(
                (snapShot.docs.map(d => ({ ...d.data(), uid: d.id })) as Array<MemberDocType>)
                .filter(user => user.permitted === undefined && !user.deleted)
            );
        });
    }, []);


    const updateUsers = (user: MemberDocType)=> {
        setUsers(
            users.map(curr_user => {
                return user.uid == curr_user.uid ? user : curr_user
            })
            .filter(user => user.permitted === undefined && !user.deleted)
        );
     };

    const [usersToShow, paginationIndices, setActiveIdx] = usePagination<MemberDocType>(
        users,
        pageQt
    );
    
    return <>
        <Flex width="100%" flexDir="column" gap="1rem" height="100%">
            <ContentHeader
               description=""
               heading={`Wait List (${users.length})`}
            />

            <Flex gap="0.3rem">
               <UsersList
                  users={usersToShow}
                  pageCounts={paginationIndices.length}
                  handlePageChange={(i) => {
                    setActiveIdx(i);
                  }}
                  updateUsers={updateUsers}
                />
            </Flex>
        </Flex>    
    </>
}

const UsersList = ({
   users,
   pageCounts,
   handlePageChange,
   updateUsers
}: {
    users: Array<MemberDocType>;
   pageCounts: number;
   handlePageChange: (page: number) => void;
   updateUsers: (user: MemberDocType)=> void;
}) => {
   const [isUnder650] = useMediaQuery('(max-width: 650px)');
   const topRef = useRef<any>(null);

   return (
    <Flex
    flex={3}
    width={'100%'}
    height={'90vh'}
    minHeight={'90vh'}
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
        <div ref= {topRef}></div>
       {users.map((user, idx) => {
          return <UserData key={idx} user={user} updateUsers = {updateUsers}/>
        })}
         </Flex>
         <Flex alignSelf={'flex-end'}>
            <Box p = {'0.5rem'}>
               <Pagination pageCounts={pageCounts} handlePageChange={(i)=> {
                    (topRef.current as HTMLElement)?.scrollIntoView({ behavior: 'smooth'});
                    handlePageChange(i)
                }} />
            </Box>
         </Flex>
        </Flex>
     );
}


const UserData = ({
    user,
    updateUsers 
 }: {
    user: MemberDocType;
    updateUsers: (user: MemberDocType)=> void;
 }) => {
    const [isUnder650] = useMediaQuery('(max-width: 650px)');
 
    const cancelModalHandler = useDisclosure();
    const toast = useToast();

    const [loading, setLoading] = useState<boolean>(false);

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
            {user.photo ? 
             <Avatar size="md" name={`${user.name}`} src={user.photo} />:
             <Avatar size={'md'} border={'1px solid white'} showBorder={true} />}
             
          <Stack spacing={0}>
             <Text fontSize="lg" whiteSpace="nowrap">
                {user.name || 'Unknown'}
             </Text>
             <Text fontSize="xs" whiteSpace="nowrap">
                {user.mobile || ''}
             </Text>
          </Stack>
                
          {/* Modal */}
 
            <ConfirmModal
                handle={cancelModalHandler}
                title=""
                question={`Are you sure to Decline Request '${
                   user.name || 'Unknown'
                }' request? `}
                onConfirm={() => {
                    const userDoc = doc(membersColRef, user.uid) 
                    setLoading(true);
                    updateDoc(userDoc, {
                     permitted: false
                    }).then(()=> {
                        toast({
                            description: `${user.name || 'unknown'} has been Declined`,
                            status: 'success'
                        })
                        updateUsers({...user, permitted: false});
                        setLoading(false);
                    }).catch(err=> setLoading(false));
                }}
            />
 
            <Flex gap="1rem" marginLeft="auto">
               <OrangeButton onClick={()=> {
                    const userDoc = doc(membersColRef, user.uid) 
                    setLoading(true);
                    updateDoc(userDoc, {
                     permitted: true
                    }).then(()=> {
                        toast({
                            description: `${user.name || 'unknown'} has been Accepted`,
                            status: 'success'
                        })
                        updateUsers({...user, permitted: true});
                        setLoading(false);
                    }).catch(err=> setLoading(false));
               }} isLoading={loading}>Accept</OrangeButton>
               <WhiteButton onClick={cancelModalHandler.onOpen} isLoading={loading}>Decline</WhiteButton>    
            </Flex>
       </Flex>
    );
};

