import { ButtonProps, extendTheme } from '@chakra-ui/react';

export const colors = {
   initialColorMode: 'dark',
   useSystemColorMode: false,
   colorMode: 'dark',
   gray: {
      '400': 'var(--white)'
   },
   fonts: {
      heading: 'GeneralSans-Medium',
      body: 'GeneralSans-Medium'
   },
   styles: {
      global: {
         'html, body': {
            fontFamily: 'GeneralSans-Medium'
         }
      }
   }
};

export const appTheme: Record<string, any> = extendTheme({ colors });

// paginator style

export const paginatorStyle: {
   baseStyles: ButtonProps;
   normalStyles: ButtonProps;
   activeStyles: ButtonProps;
   separatorStyles: ButtonProps;
} = {
   baseStyles: {
      w: 7,
      h: 5,
      fontSize: 'sm'
   },
   normalStyles: {
      w: 10,
      px: '1rem',
      fontSize: 'sm',
      _hover: {
         bg: 'var(--orange-color)',
         color: 'white'
      },
      bg: 'var(--white-color)',
      color: 'black'
   },
   activeStyles: {
      fontSize: 'sm',
      _hover: {},
      bg: 'var(--orange-color)',
      color: 'white',
      w: 10,
      h: 10
   },
   separatorStyles: {
      bg: 'var(--white-color)',
      color: 'black'
   }
};
