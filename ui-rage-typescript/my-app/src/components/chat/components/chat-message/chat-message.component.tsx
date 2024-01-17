import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { ChatMessage } from "../../../../utils/chat/model";

interface ChatMessageProps {
  chatMessage: ChatMessage;
}

export const ChatMessageComponent = (props: ChatMessageProps) => {
  return (
    <VStack align="flex-start" w="full" spacing="1px">
      <HStack justify="space-between" w="full">
        <HStack>
          <Text fontSize="xs" color="gray.400" isTruncated>
            {props.chatMessage.time}
          </Text>
          <Text fontWeight="bold" color="gray.200" isTruncated>
            {props.chatMessage.playerName}:
          </Text>
        </HStack>
      </HStack>
      <Box
        w="full" // Full width
        p="2"
        bg="blue.500"
        borderRadius="md"
        boxShadow="md"
      >
        <Text color="white">
          {props.chatMessage.message}
        </Text>
      </Box>
    </VStack>
  );
};
