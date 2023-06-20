import { useMediaQuery } from '@chakra-ui/react';
import { Oxygen } from 'next/font/google';
const oxygen = Oxygen({ subsets: ['latin'], weight: ['300'] });

/// page left content Wrapper
export default function MainLayout({
   children,
   padding,
   className
}: {
   children: React.ReactNode;
   className?: string;
   padding?: string;
}) {
   const [isUnder500] = useMediaQuery('(max-width: 500px');

   return (
      <main
         style={{
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            padding: `${!padding ? (isUnder500 ? '0.5rem' : '1rem') : padding}`,
            paddingBottom: '0',
            marginBottom: isUnder500 ? '2rem' : 'initial'
         }}
         className={className ? className : oxygen.className}
      >
         {children}
      </main>
   );
}
