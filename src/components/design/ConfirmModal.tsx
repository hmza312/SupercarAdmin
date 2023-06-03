import { UseDisclosureProp } from '@/types/UseDisclosureProp';
import ModalWrapper from './ModalWrapper';
import { Flex, Heading, Text } from '@chakra-ui/react';
import OrangeButton from './OrangeButton';
import WhiteButton from './WhiteButton';

interface ConfirmModal {
   handle: UseDisclosureProp;
   title: string;
   question: string | React.ReactNode;
   onConfirm: () => void;
}

const ConfirmModal = (props: ConfirmModal) => {
   return (
      <ModalWrapper {...props.handle}>
         <Flex p={'1rem'} flexDir={'column'} alignItems={'center'} gap={'2rem'}>
            <Heading fontSize={'2xl'} fontWeight={'600'} color={'black'}>
               {props.title}
            </Heading>

            <Text fontWeight={''} fontSize={'xl'} color={'black'} textAlign={'center'}>
               {props.question}
            </Text>

            <Flex gap={'2rem'} flexWrap={'wrap'}>
               <OrangeButton
                  onClick={() => {
                     props.onConfirm();
                     props.handle.onClose();
                  }}
               >
                  Confirm
               </OrangeButton>
            </Flex>
         </Flex>
      </ModalWrapper>
   );
};

export default ConfirmModal;
