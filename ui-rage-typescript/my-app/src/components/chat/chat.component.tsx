import React, { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./components/chat-message/chat-message.component";
import { Message } from "./constants";
import {
  Box,
  Input,
  Button,
  VStack,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";

export const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (input.trim() === "") return;
    const newMessage: Message = {
      time: new Date().toLocaleTimeString().slice(0, -3),
      username: "YourUsername",
      message: input,
    };
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
    setInput("");
    onToggle();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "T" || event.key === "t") && !isOpen) {
        onToggle();
        event.preventDefault();
        setTimeout(() => inputRef.current?.focus(), 0);
      } else if (event.key === "Escape" && isOpen) {
        onToggle();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onToggle]);

  return (
    <Box
      className="chat-window"
      position="fixed"
      top="4"
      left="4"
      w={{ base: "95%", md: "50vw" }}
      maxW="600px"
      h="400px"
      display="flex"
      flexDir="column"
      justifyContent="flex-end"
      bg="gray.800"
      borderRadius="md"
      boxShadow="lg"
      overflow="hidden"
    >
      <VStack
        className="chat-messages"
        overflowY="auto"
        p="3"
        spacing="3"
        flex="1"
      >
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            time={msg.time}
            message={msg.message}
            username={msg.username}
          />
        ))}
      </VStack>
      {isOpen && (
        <Box
          className="chat-input-container"
          p="3"
          bg="gray.900"
          borderTop="1px"
          borderColor="gray.700"
        >
          <Input
            ref={inputRef}
            className="chat-input"
            variant="filled"
            placeholder="Type a message..."
            _placeholder={{ opacity: 1, color: "gray.500" }} // Correct usage for placeholder styling
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            size="md"
            bg="gray.700"
            color="white"
            borderRadius="md"
            border="0"
            autoFocus
            mr="3"
          />

          <IconButton
            icon={<FaPaperPlane />}
            colorScheme="blue"
            onClick={handleSend}
            aria-label="Send message"
            size="md"
            isRound
          />
        </Box>
      )}
      {!isOpen && (
        <IconButton
          icon={<FaTimes />}
          colorScheme="red"
          variant="ghost"
          onClick={onToggle}
          aria-label="Close chat"
          alignSelf="flex-end"
          m="2"
        />
      )}
    </Box>
  );
};
