import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList, MenuOptionGroup } from '@chakra-ui/react';

import type { MenuItemProps } from '@chakra-ui/react';

interface DropDownProps extends MenuItemProps {
   menuTitle: string;
   menuitems: Array<string> | Array<React.ReactNode>;
   onSelected: (selected: string) => void;
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
      <MenuList bg={'var(--white-color)'} color={'black'} maxH={'60vh'} overflow={'scroll'}>
         {props.menuitems.map((item, idx) => {
            return (
               <MenuItem
                  bg={'var(--white-color)'}
                  key={idx}
                  fontWeight={'800'}
                  _hover={{ bg: 'var(--orange-color)', color: 'var(--white-color)' }}
                  value={item as string}
                  onClick={(e) => {
                     props.onSelected(item as string);
                  }}
                  {...props}
               >
                  {item}
               </MenuItem>
            );
         })}
      </MenuList>
   </Menu>
);

export default DropDown;
