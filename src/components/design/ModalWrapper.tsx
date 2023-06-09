import {
   Box,
   Button,
   Input,
   InputProps,
   Menu,
   MenuButton,
   MenuItem,
   MenuItemProps,
   MenuList,
   Modal,
   ModalContent,
   ModalOverlay,
   ModalProps,
   Text
} from '@chakra-ui/react';
import DropDown from './DropDown';
import { ChevronDownIcon } from '@chakra-ui/icons';

interface ModalWrapperProps extends ModalProps {}

const ModalWrapper = (props: ModalWrapperProps) => (
   <Modal {...props} isCentered>
      <ModalOverlay />
      <ModalContent bg={'var(--white-color)'} p={'1rem'}>
         {props.children}
      </ModalContent>
   </Modal>
);

interface ModalInputProps extends InputProps {
   labelValue: string;
   isOptional?: boolean;
   error?: null | string;
}

export const ModalInput = (props: ModalInputProps) => (
   <Box>
      <Text mb="2px" fontWeight={'600'} fontSize={'15px'}>
         {props.labelValue}
      </Text>
      <Input
         size="md"
         width={'100%'}
         border={`1px solid ${props.isOptional ? 'var(--orange-color)' : 'var(--info-text-color)'}`}
         _hover={{
            border: `1px solid ${
               props.isOptional ? 'var(--orange-color)' : 'var(--info-text-color)'
            }`
         }}
         _placeholder={{
            color: 'var(--input-placeholder-color)',
            fontWeight: '400',
            fontSize: '14px'
         }}
         {...props}
      />

      {props.error && (
         <Text mb="2px" fontWeight={'600'} fontSize={'13px'} color={'red.400'}>
            {props.error}
         </Text>
      )}
   </Box>
);

interface ModalDropDownProps extends MenuItemProps {
   labelValue: string;
   menuTitle: string;
   menuItems: Array<string> | Array<React.ReactNode>;
   onSelected: (selected: string) => void;
   error?: null | string;
}

export const ModalDropDown = (props: ModalDropDownProps) => (
   <Box>
      <Text mb="2px" fontWeight={'600'} fontSize={'15px'}>
         {props.labelValue}
      </Text>
      <Menu>
         <MenuButton
            as={Button}
            bg={'transparent'}
            border={'1px solid var(--info-text-color)'}
            rightIcon={<ChevronDownIcon />}
            _hover={{ bg: 'var(--white-color)' }}
            _active={{ bg: 'transparent' }}
            width={'100%'}
            fontWeight={'400'}
            fontSize={'15px'}
         >
            {props.menuTitle}
         </MenuButton>
         <MenuList
            bg={'var(--white-color)'}
            color={'black'}
            maxH={'60vh'}
            overflow={'scroll'}
            width={'100%'}
         >
            {props.menuItems.map((item, idx) => {
               return (
                  <MenuItem
                     bg={'var(--white-color)'}
                     key={idx}
                     _hover={{ bg: 'var(--orange-color)', color: 'var(--white-color)' }}
                     value={item as string}
                     onClick={() => {
                        props.onSelected(item as string);
                     }}
                     width={'100%'}
                     fontWeight={'400'}
                     fontSize={'15px'}
                     {...props}
                  >
                     {item}
                  </MenuItem>
               );
            })}
         </MenuList>
      </Menu>

      {props.error && (
         <Text mb="2px" fontWeight={'600'} color={'red.400'} fontSize={'13px'}>
            {props.error}
         </Text>
      )}
   </Box>
);

export const ModalFileInput = (props: ModalInputProps) => (
   <Box>
      <Text mb="2px" fontWeight={'600'} fontSize={'15px'}>
         {props.labelValue}
      </Text>
      <Input
         className="custom-file-input"
         size="md"
         width={'100%'}
         border={`1px solid ${props.isOptional ? 'var(--orange-color)' : 'var(--info-text-color)'}`}
         _hover={{
            border: `1px solid ${
               props.isOptional ? 'var(--orange-color)' : 'var(--info-text-color)'
            }`
         }}
         _placeholder={{
            color: 'var(--input-placeholder-color)',
            fontWeight: '400',
            fontSize: '14px'
         }}
         placeholder="Click to Select file"
         {...props}
      />

      {props.error && (
         <Text mb="2px" fontWeight={'600'} fontSize={'13px'} color={'red.400'}>
            {props.error}
         </Text>
      )}
   </Box>
);

export default ModalWrapper;
