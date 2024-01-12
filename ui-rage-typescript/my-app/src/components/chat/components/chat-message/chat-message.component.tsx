import { Box, Text, VStack } from "@chakra-ui/react";

interface ChatMessageProps {
  key: number;
  time: string;
  username: string;
  message: string;
}

export const ChatMessage = ({ time, username, message }: ChatMessageProps) => {
  return (
    <VStack align="flex-start" w="full" spacing="0">
      <Text fontSize="xs" color="gray.400">
        {time}
      </Text>
      <Box
        w="full" // Full width
        p="2"
        bg="blue.500"
        borderRadius="md"
        maxWidth="80%"
        boxShadow="md"
      >
        <Text fontWeight="bold" color="gray.100">
          {username}:
        </Text>
        <Text color="white">
          {message}
        </Text>
      </Box>
    </VStack>
  );
};
