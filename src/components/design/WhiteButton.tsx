import { Button, ButtonProps, background } from '@chakra-ui/react';

interface CustomButtonProps extends ButtonProps {
   // Add any additional custom props you want to accept
   children: React.ReactNode;
}

const WhiteButton: React.FC<CustomButtonProps> = (props) => (
   <Button
      background="var(--white-color)"
      color="black"
      _hover={{
         background: 'var(--white-color)'
      }}
      {...props}
   >
      {props.children}
   </Button>
);

export default WhiteButton;
