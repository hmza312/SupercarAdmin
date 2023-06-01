import { ROUTING } from "@/util/constant";
import { ChevronLeftIcon, SearchIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Flex, Heading, Icon, Input, InputGroup, InputRightElement, Stack, Text, useMediaQuery } from "@chakra-ui/react";
import Link from "next/link";
import OrangeButton from "../design/OrangeButton";
import { BsEmojiSmile, BsSend } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";

const ChatRoom = ()=> <Flex width={'100%'} height={'100%'} gap={'0.5rem'} flexDir={'column'}>
    <BackBtn />

    <Flex flex={''} gap={'1rem'} height={'85%'}>
        {/* Chatroom */}
        <Flex height={'100%'} width={'100%'} flex={2} gap={'1rem'} flexDir={'column'}>
            <Box width={'100%'}>
                <ChatHeader avatar="" customerName=""/>
            </Box>
            <ChatContainer />
        </Flex>
        <SideBar />
    </Flex>
</Flex>

const BackBtn = ()=> <Link href={ROUTING.customers}>
    <Heading fontWeight={'600'} fontSize={'2xl'} py={'1rem'}>
        <ChevronLeftIcon/>
        {`Back to customers`}
    </Heading>
</Link> 

const ChatHeader = ({ customerName, avatar}: { customerName: string, avatar: string})=> <Flex 
    width={'100%'} p={'1rem'} bg={'var(--grey-color)'} rounded={'lg'} gap={'1rem'} 
>
    <Avatar />
    <Stack spacing={'-0.1rem'} color={'var(--info-text-color)'}>
        <Heading fontSize={'xl'} fontWeight={'600'}>Customer Name</Heading>
        <Text fontSize={'small'} fontWeight={'500'}>web Designer</Text>
    </Stack>
</Flex> 

const ChatContainer = ()=> {
    const [isUnder500] = useMediaQuery ("(max-width: 500px)");

return <Flex 
    height={'100%'} width={'100%'} bg= {'var(--grey-color)'} overflow={'auto'}
    p = {'0.5rem'} rounded={'lg'} flexDir={'column'} gap={'0.5rem'}
>
    {/* chat container */}
    <Flex flex={1} width={'100%'} overflowY={'auto'} maxH={'100%'} >
        {/*  */}
    </Flex>   
    {/* search box */}
    <Flex width={'100%'} marginTop={'auto'}>
        <InputGroup size={'md'} colorScheme="gray">
            <Input
               pr="0.5rem"
               width={'100%'}
               placeholder="Write a message..."
               background={'var(--light-grey-color)'}
               border={'none'}
               p = {'1.5rem'}
               _placeholder={{ color: 'var(--white-color)', fontSize: '12px', transform: 'translateY(-1px)'}}
            />
            <InputRightElement height={'100%'} width={'15%'}>
               {' '} 
               <Flex alignItems={'center'} gap={'0.4rem'}>

                    <Icon fontSize={'xl'}>
                        <ImAttachment />
                    </Icon>

                    <Icon fontSize={'xl'}>
                        <BsEmojiSmile/>
                    </Icon>

                    <Button 
                        colorScheme="whatsapp" rounded={'50%'} 
                        minH={'37px'} minW={'37px'} maxH={'37px'} maxW={'37px'}
                        marginLeft={'auto'}
                    >
                        <Icon fontSize={'xl'} transform={'translateY(1.5px)'}>
                            <BsSend/>
                        </Icon>
                    </Button>
               </Flex>
               {' '}
            </InputRightElement>
        </InputGroup>
    </Flex>
</Flex>}

const SideBar = ()=> {

    const [isUnder500] = useMediaQuery ("(max-width: 500px)");
    
return <Flex 
    height={'100%'} bg={'var(--grey-color)'} rounded={'xl'} flex={1.2} p ={'1rem'}
     flexDir={'column'} gap={'0.5rem'}
>
    <Heading fontSize={'xl'} fontWeight={'600'}>Documents</Heading>

    <InputGroup size={isUnder500 ? 'sm' : 'md'} colorScheme="gray">
        <Input
           pr="0.5rem"
           width={isUnder500 ? 'xs' : 'md'}
           placeholder="Search documents..."
           background={'var(--light-grey-color)'}
           border={'none'}
           _placeholder={{ color: 'var(--white-color)', fontSize: '12px', transform: 'translateY(-1px)'}}
        />
        <InputRightElement width="2.5rem">
           {' '} 
           <SearchIcon />{' '}
        </InputRightElement>
    </InputGroup>

    <OrangeButton>Add New Document</OrangeButton>
</Flex>}

export default ChatRoom;
