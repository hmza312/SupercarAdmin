import { Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import { DrawerProps } from "@chakra-ui/react";

interface DrawerWrapperProps extends DrawerProps {
    children: React.ReactNode
} 

const DrawerWrapper = (props: DrawerWrapperProps)=> <Drawer {...props}>
    <DrawerOverlay />
    <DrawerContent>
      <DrawerBody bg="var(--bg-color)">
        {props.children}
      </DrawerBody>
    </DrawerContent>
</Drawer>; 

export default DrawerWrapper;
