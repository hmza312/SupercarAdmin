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

import { useRouter } from "next/router";
import { ROUTING } from "@/util/constant";
import React from "react";

interface SideBarLink {
  text: string;
  linkTo: (typeof ROUTING)[keyof typeof ROUTING];
  icon: React.ReactNode;
}

const sideBarLinks: Array<SideBarLink> = [
  { text: "Dashboard", linkTo: ROUTING.home, icon: <RxDashboard /> },
  { text: "Customers", linkTo: ROUTING.customers, icon: <BiStats /> },
  { text: "Vehicles", linkTo: ROUTING.vehicles, icon: <IoWalletOutline /> },
  { text: "Requests", linkTo: ROUTING.requests, icon: <BiUser /> },
  { text: "Payments", linkTo: ROUTING.payments, icon: <FiSettings /> },
  { text: "Waitlist", linkTo: ROUTING.waitList, icon: <FiSettings /> },
  { text: "Settings", linkTo: ROUTING.settings, icon: <BsShieldCheck /> },
  { text: "Help Centre", linkTo: ROUTING.helpCentre, icon: <BiHelpCircle /> },
];

export default function SideBar() {
  const router = useRouter();

  return (
    <>
      <Flex
        display={"flex"}
        minHeight={"100%"}
        bg={"white"}
        width={"20rem"}
        minW={"20rem"}
        background={"var(--dark-color)"}
        rounded={"2xl"}
        overflow={"auto"}
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
          {sideBarLinks.map((link, idx) => {
            return (
              <React.Fragment key={idx}>
                <SideBarLinks
                  linkTo={link.linkTo}
                  isActive={router.asPath == link.linkTo}
                  heading={link.text}
                  linkIcon={link.icon}
                />
                {idx == 5 && (
                  <Divider
                    marginTop={"0.2rem"}
                    background={"var(--blue-color)"}
                  />
                )}
              </React.Fragment>
            );
          })}
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
  linkTo,
}: {
  isActive: boolean;
  heading: string;
  linkIcon: React.ReactNode;
  linkTo: string;
}) => {
  return (
    <>
      <Link href={linkTo}>
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
