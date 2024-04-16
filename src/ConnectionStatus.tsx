import { HStack, Icon, Text } from "@chakra-ui/react";
import { VscCircleFilled } from "react-icons/vsc";

type ConnectionStatusProps = {
  connection: "connected" | "disconnected" | "desynchronized";
  darkMode: boolean;
};

function ConnectionStatus({ connection, darkMode }: ConnectionStatusProps) {
  return (
    <HStack spacing={1}>
      <Icon
        as={VscCircleFilled}
        color={
          {
            connected: "#8FE855",
            disconnected: "orange.500",
            desynchronized: "red.500",
          }[connection]
        }
      />
      <Text
        fontSize="sm"
        //fontStyle="italic"
        color={darkMode ? "gray.300" : "gray.600"}
      >
        {
          {
            connected: "Connected",
            disconnected: "Lost connection, reconnecting...",
            desynchronized: "Disconnected, please refresh the page",
          }[connection]
        }
      </Text>
    </HStack>
  );
}

export default ConnectionStatus;
