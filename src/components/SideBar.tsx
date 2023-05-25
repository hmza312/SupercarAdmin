import {
  Flex,
  Heading,
  Icon,
  Divider,
  Avatar,
  Text,
  Stack,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import { BiStats, BiUser, BiHelpCircle } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import { IoWalletOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { BsShieldCheck } from "react-icons/bs";
import Link from "next/link";

export default function SideBar() {
  return (
    <>
      <Flex
        display={"flex"}
        height={"100%"}
        bg={"white"}
        width={"20rem"}
        minW={"20rem"}
        background={"var(--dark-color)"}
        rounded={"2xl"}
        flexDir={"column"}
      >
        <Link href={"/"}>
          <Flex flexDir={"column"} p={"2.3rem"}>
            {/* <Heading fontSize={'2xl'}>SuperCar</Heading>
                    <Heading fontSize={'2xl'}>Automation</Heading> */}
            {/*eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={"/images/supercar-logo.png"}
              alt="company logo"
              loading="eager"
            />
          </Flex>
        </Link>

        {/* icons */}
        <Flex flexDir={"column"} p={"2rem"} gap={"0.3rem"} pt={"0"}>
          <SideBarLinks
            isActive={true}
            heading={"Dashboard"}
            linkIcon={<RxDashboard />}
          />
          <SideBarLinks
            isActive={false}
            heading={"Customers"}
            linkIcon={<BiStats />}
          />
          <SideBarLinks
            isActive={false}
            heading={"Vehicles"}
            linkIcon={<IoWalletOutline />}
          />
          <SideBarLinks
            isActive={false}
            heading={"Requests"}
            linkIcon={<BiUser />}
          />
          <SideBarLinks
            isActive={false}
            heading={"Payments"}
            linkIcon={<FiSettings />}
          />
          <SideBarLinks
            isActive={false}
            heading={"Waitlist"}
            linkIcon={<FiSettings />}
          />

          <Divider marginTop={"0.2rem"} background={"var(--blue-color)"} />

          <SideBarLinks
            isActive={false}
            heading={"Settings"}
            linkIcon={<BsShieldCheck />}
          />
          <SideBarLinks
            isActive={false}
            heading={"Help Centre"}
            linkIcon={<BiHelpCircle />}
          />
        </Flex>

        <Flex p={"0.5rem"} px={"2rem"} alignItems={"center"} cursor={"pointer"}>
          <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
          <Stack gap={"0"} px={"0.6rem"} spacing={"-3px"}>
            <Text fontSize={"xl"}>Ethan Duran</Text>
            <Text px={"2px"}>Admin</Text>
          </Stack>

          <Icon flexFlow={"1"} justifySelf={"flex-end"} mx={"1rem"}>
            <ChevronDownIcon />
          </Icon>
        </Flex>
      </Flex>
    </>
  );
}

const SideBarLinks = ({
  isActive,
  heading,
  linkIcon,
}: {
  isActive: boolean;
  heading: string;
  linkIcon: React.ReactNode;
}) => {
  return (
    <>
      <Link href={"/"}>
        <Flex
          bg={`${isActive ? "var(--orange-color)" : ""}`}
          p={"1rem"}
          rounded={"xl"}
          cursor={"pointer"}
          gap={"0.5rem"}
        >
          <Icon fontSize={"2xl"}>{linkIcon}</Icon>
          {heading}
        </Flex>
      </Link>
    </>
  );
};
