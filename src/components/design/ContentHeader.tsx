import { SearchIcon } from "@chakra-ui/icons";
import { Flex, Heading, Input, InputGroup, InputRightElement, Stack, Text } from "@chakra-ui/react";
import type { InputProps } from "@chakra-ui/react"; 

interface ContentHeaderProps extends InputProps {
    heading: string, description: string
}

export default function ContentHeader (props: ContentHeaderProps) {
    return <Flex width={"100%"} flexDir={"row"} alignItems={"center"}>
        <Stack spacing={"0.3rem"}>
          <Heading fontSize={"2xl"}>{props.heading}</Heading>
          <Text color={"rgba(166, 166, 166, 1)"}>{props.description}</Text>
        </Stack>

        <Flex
          height={"100%"}
          marginLeft={"auto"}
          alignItems={"center"}
          alignSelf={"flex-end"}
          marginBottom={"-0.1rem"}
        >
          <InputGroup size="md" colorScheme="gray">
            <Input pr="0.5rem" width={"md"} placeholder="Search anything" background={'var(--grey-color)'} {...props} />
            <InputRightElement width="2.5rem"> <SearchIcon /> </InputRightElement>
          </InputGroup>
        </Flex>
    </Flex>
}



