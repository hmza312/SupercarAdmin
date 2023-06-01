import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, ButtonProps, background } from '@chakra-ui/react';

interface CustomButtonProps extends ButtonProps {
   // Add any additional custom props you want to accept
}

const DropDownButton: React.FC<CustomButtonProps> = (props) => (
   <Button
      as={Button}
      bg={'transparent'}
      border={'1px solid var(--dropdown-color)'}
      _hover={{ bg: 'var(--grey-color)' }}
      _active={{ bg: 'transparent' }}
      fontWeight={'500'}
      {...props}
   >
      {props.children} <ChevronDownIcon fontSize={'xl'} mx={'0.5rem'} />
   </Button>
);

export default DropDownButton;
