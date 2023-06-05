import { Button, ButtonProps, background } from '@chakra-ui/react';

interface CustomButtonProps extends ButtonProps {
   // Add any additional custom props you want to accept
   children: React.ReactNode;
}

const OrangeButton: React.FC<CustomButtonProps> = (props) => (
   <Button
      background="var(--orange-color)"
      color="white"
      _hover={{
         background: 'var(--orange-color)'
      }}
      {...props}
   >
      {props.children}
   </Button>
);

export default OrangeButton;
