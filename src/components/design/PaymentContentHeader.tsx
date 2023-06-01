import { SearchIcon } from '@chakra-ui/icons';
import {
   Flex,
   Heading,
   Icon,
   Input,
   InputGroup,
   InputRightElement,
   Stack,
   Text,
   useMediaQuery
} from '@chakra-ui/react';
import type { InputProps } from '@chakra-ui/react';
import OrangeButton from './OrangeButton';
import DropDownButton from './DropDownButton';
import { BsFillCalendarWeekFill } from 'react-icons/bs';

interface ContentHeaderProps extends InputProps {
   heading: string;
   description: string;
}

export default function PaymentContentHeader(props: ContentHeaderProps) {
   const [isUnder850] = useMediaQuery('(max-width: 850px)');

   return (
      <Flex
         width={'100%'}
         flexDir={isUnder850 ? 'column' : 'row'}
         alignItems={'center'}
         gap={'1rem'}
         p={isUnder850 ? '0.5rem' : 'initial'}
      >
         <Stack spacing={'0.3rem'}>
            {isUnder850 ? (
               <center>
                  <Heading fontSize={'2xl'} whiteSpace={'nowrap'}>
                     {props.heading}
                  </Heading>
                  <Text color={'rgba(166, 166, 166, 1)'}>{props.description}</Text>
               </center>
            ) : (
               <>
                  <Heading fontSize={'2xl'}>{props.heading}</Heading>
                  <Text color={'rgba(166, 166, 166, 1)'}>{props.description}</Text>
               </>
            )}
         </Stack>

         {isUnder850 ? (
            <center>
               <SearchBar {...props} />
            </center>
         ) : (
            <SearchBar {...props} />
         )}

         <DropDownButton transform={'translateY(1px)'}>
            <Icon fontSize={'xl'} mx={'0.3rem'}>
               <BsFillCalendarWeekFill />
            </Icon>
            10 May - 20 May
         </DropDownButton>
         <OrangeButton transform={'translateY(1px)'}>Add New Payment</OrangeButton>
      </Flex>
   );
}

const SearchBar = (props: InputProps) => {
   const [isUnder500] = useMediaQuery('(max-width: 500px)');
   return (
      <>
         <Flex
            height={'100%'}
            marginLeft={'auto'}
            alignItems={'center'}
            alignSelf={'flex-end'}
            marginBottom={'-0.1rem'}
         >
            <InputGroup size={isUnder500 ? 'sm' : 'md'} colorScheme="gray">
               <Input
                  pr="0.5rem"
                  width={isUnder500 ? 'xs' : 'md'}
                  placeholder="Search anything...."
                  background={'var(--grey-color)'}
                  {...props}
               />
               <InputRightElement width="2.5rem">
                  {' '}
                  <SearchIcon />{' '}
               </InputRightElement>
            </InputGroup>
         </Flex>
      </>
   );
};
