import { Flex, Icon, Text } from "@chakra-ui/react";
import { VscLayoutSidebarLeft } from "react-icons/vsc";

const version =
  typeof import.meta.env.VITE_SHA === "string"
    ? import.meta.env.VITE_SHA.slice(0, 7)
    : "development";

type FooterProps = {
  toggleSidebar: () => void;
};

function Footer({ toggleSidebar }: FooterProps) {
  return (
    <Flex h="22px" bgColor="#0D41D2" color="white">
      <Flex
        h="100%"
        bgColor="#8FE855 "
        color="black"
        pl={2.5}
        pr={4}
        fontSize="sm"
        align="center"
        cursor="pointer"
        onClick={toggleSidebar}
      >
        <Icon as={VscLayoutSidebarLeft} mb={-0.5} mr={1} />
        <Text fontSize="xs">Toggle sidebar</Text>
      </Flex>
      <Flex
        h="100%"
        bgColor="#0D41D2"
        ml="auto"
        pl={2.5}
        pr={4}
        fontSize="sm"
        align="center"
      >
        <Text fontSize="xs">Version: {version}</Text>
      </Flex>
    </Flex>
  );
}

export default Footer;
