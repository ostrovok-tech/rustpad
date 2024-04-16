import {
  Button,
  ButtonGroup,
  HStack,
  Icon,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FaPalette } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { UserInfo } from "./rustpad";

type UserProps = {
  info: UserInfo;
  isMe?: boolean;
  onChangeName?: (name: string) => unknown;
  onChangeColor?: () => unknown;
  darkMode: boolean;
};

function User({
  info,
  isMe = false,
  onChangeName,
  onChangeColor,
  darkMode,
}: UserProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isValidName = () => {
    if (!inputRef.current) return false;
    return inputRef.current.value.length > 0;
  };

  const onNameChangeSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    onClose();
    if (!isValidName()) return;
    onChangeName?.(inputRef.current?.value ?? "");
  };

  const nameColor = `hsl(${info.hue}, 90%, ${darkMode ? "70%" : "25%"})`;
  return (
    <Popover
      placement="right"
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={inputRef}
    >
      <PopoverTrigger>
        <HStack
          p={2}
          rounded="md"
          _hover={{
            bgColor: darkMode ? "#464647" : "gray.200",
            cursor: "pointer",
          }}
          onClick={() => isMe && onOpen()}
        >
          <Icon as={VscAccount} />
          <Text fontWeight="medium" color={nameColor}>
            {info.name}
          </Text>
          {isMe && <Text>(you)</Text>}
        </HStack>
      </PopoverTrigger>
      <PopoverContent
        bgColor={darkMode ? "#333333" : "white"}
        borderColor={darkMode ? "#464647" : "gray.200"}
      >
        <form onSubmit={onNameChangeSubmit}>
          <PopoverHeader
            fontWeight="semibold"
            borderColor={darkMode ? "#464647" : "gray.200"}
          >
            Update Info
          </PopoverHeader>
          <PopoverArrow bgColor={darkMode ? "#333333" : "white"} />
          <PopoverCloseButton />
          <PopoverBody borderColor={darkMode ? "#464647" : "gray.200"}>
            <Input ref={inputRef} mb={2} maxLength={25} />
            <Button
              size="sm"
              w="100%"
              leftIcon={<FaPalette />}
              colorScheme={darkMode ? "whiteAlpha" : "gray"}
              onClick={onChangeColor}
            >
              Change Color
            </Button>
          </PopoverBody>
          <PopoverFooter
            d="flex"
            justifyContent="flex-end"
            borderColor={darkMode ? "#464647" : "gray.200"}
          >
            <ButtonGroup size="sm">
              <Button colorScheme="blue" type="submit">
                Done
              </Button>
            </ButtonGroup>
          </PopoverFooter>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export default User;
