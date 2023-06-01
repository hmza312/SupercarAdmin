import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

import type { MenuListProps } from '@chakra-ui/react';

interface DropDownProps extends MenuListProps {
   menuTitle: string;
   menuItems: Array<string> | Array<React.ReactNode>;
}

const DropDown = (props: DropDownProps) => (
   <Menu>
      <MenuButton
         as={Button}
         bg={'transparent'}
         border={'1px solid var(--dropdown-color)'}
         rightIcon={<ChevronDownIcon />}
         _hover={{ bg: 'var(--orange-color)' }}
         _active={{ bg: 'transparent' }}
      >
         {props.menuTitle}
      </MenuButton>
      <MenuList bg={'var(--white-color)'} color={'black'} {...props}>
         {props.menuItems.map((item, idx) => {
            return (
               <MenuItem
                  bg={'var(--white-color)'}
                  key={idx}
                  fontWeight={'800'}
                  _hover={{ bg: 'var(--orange-color)', color: 'var(--white-color)' }}
               >
                  {item}
               </MenuItem>
            );
         })}
      </MenuList>
   </Menu>
);

export default DropDown;
