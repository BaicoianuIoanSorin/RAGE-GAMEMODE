import { Box, HStack, Text, VStack } from "@chakra-ui/react";

interface ChatMessageProps {
  time: string;
  username: string;
  message: string;
}

export const ChatMessage = ({ time, username, message }: ChatMessageProps) => {
  return (
    <VStack align="flex-start" w="full" spacing="1px">
      <HStack justify="space-between" w="full">
        <HStack>
          <Text fontSize="xs" color="gray.400" isTruncated>
            {time}
          </Text>
          <Text fontWeight="bold" color="gray.200" isTruncated>
            {username}:
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
          {message}
        </Text>
      </Box>
    </VStack>
  );
};
