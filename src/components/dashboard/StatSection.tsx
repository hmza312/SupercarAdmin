import { Badge, Box, Flex, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';

export default function StatSection({
   children,
   title,
   count,
   percentage,
   badgeStatus,
   routeTo
}: {
   children: React.ReactNode;
   title: string;
   count: number;
   percentage: string;
   badgeStatus: 'green' | 'red';
   routeTo: string;
}) {
   return (
      <Link href={routeTo}>
         <Flex width={'100%'} height={'100%'} gap={'1.5rem'} alignItems={'center'} p={'2rem'}>
            <Box
               background={'var(--orange-color)'}
               justifyContent={'center'}
               alignItems={'center'}
               p={'0.3rem'}
               rounded={'md'}
            >
               {children}
            </Box>

            <Box flexDir={'column'}>
               <Text>{title}</Text>
               <Flex justifyContent={'space-between'}>
                  <Heading fontSize={'2xl'}>{count}</Heading>
                  <Badge
                     display={'block'}
                     alignSelf={'center'}
                     justifySelf={'flex-end'}
                     colorScheme={badgeStatus}
                  >
                     {percentage}
                  </Badge>
               </Flex>
            </Box>
         </Flex>
      </Link>
   );
}
