import { paginatorStyle } from '@/styles/Style';
import { Flex } from '@chakra-ui/react';

import { Paginator, Container, Previous, Next, PageGroup } from 'chakra-paginator';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

const Pagination = ({
   pageCounts,
   handlePageChange
}: {
   pageCounts: number;
   handlePageChange: (page: number) => void;
}) => (
   <>
      {/*NOTE! typescript yelling about Paginator props has no children component  */}
      {/*@ts-ignore */}
      <Paginator
         outerLimit={2}
         pagesQuantity={pageCounts}
         innerLimit={1}
         onPageChange={handlePageChange}
         activeStyles={paginatorStyle.activeStyles}
         normalStyles={paginatorStyle.normalStyles}
         separatorStyles={paginatorStyle.separatorStyles}
      >
         <Container align="center" gap={'0.6rem'} padding={0} margin={0}>
            <Previous
               bg={'var(--grey-color)'}
               color={'white'}
               _hover={{
                  bg: 'var(--grey-color)',
                  border: '1px solid var(--white-color)'
               }}
            >
               <AiOutlineArrowLeft />
            </Previous>
            <PageGroup isInline align="center" />
            <Next
               bg={'var(--grey-color)'}
               color={'white'}
               _hover={{
                  bg: 'var(--grey-color)',
                  border: '1px solid var(--white-color)'
               }}
            >
               <AiOutlineArrowRight />
            </Next>
         </Container>
      </Paginator>
   </>
);

export default Pagination;
