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
  useToast,
} from "@chakra-ui/react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import { Textarea } from "@chakra-ui/react";
import { makeToast } from "../../utils/components-used/toast";
import { ChatEvents } from "../../utils/chat/events.constants";
import { ChatEventInfo } from "../../utils/chat/model";

export const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const [windowOpacity, setWindowOpacity] = useState(1);
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    // Function to handle the dimming logic
    const dimChatWindow = () => {
      if (new Date().getTime() - (lastMessageTime?.getTime() || 0) >= 5000) {
        setWindowOpacity(0.5);
      }
    };

    // Set the initial timeout
    let timeout = setTimeout(dimChatWindow, 5000);

    // Clear the timeout if the input changes (i.e., user is typing)
    const clearDimTimeout = () => {
      clearTimeout(timeout);
      setWindowOpacity(1); // Keep the window fully visible while typing
      timeout = setTimeout(dimChatWindow, 5000); // Reset the dim timeout
    };

    // Event listener for input changes
    inputRef.current?.addEventListener("input", clearDimTimeout);

    // Cleanup timeout and event listener when the component unmounts or input changes
    return () => {
      clearTimeout(timeout);
      inputRef.current?.removeEventListener("input", clearDimTimeout);
    };
  }, [input, lastMessageTime]);
  
  const handleSend = async () => {
    if (input.trim() === "") return;
    
    // Check if the message exceeds 250 characters
    if (input.length > 250) {
      console.log("Message cannot exceed 250 characters.");
      if ("rpc" in window && "callClient" in window.rpc) {
        makeToast(
          window.rpc,
          toast,
          "Chat",
          "Message cannot exceed 250 characters.",
          "error"
        );
      }
      // Optionally, clear the input or provide visual feedback to the user here.
      // setInput("");
      // You might also want to set some error state and display an error message to the user.
      return;
    }

    if (input.startsWith("/")) {
      if ("rpc" in window && "callClient" in window.rpc) {
        // window.rpc.callClient("chatCommand", input);
        let chatEventInfo: ChatEventInfo = await window.rpc.callClient(ChatEvents.CHAT_COMMAND, input);
        makeToast(window.rpc, toast, chatEventInfo.title, chatEventInfo.description, chatEventInfo.status);
        
        
      }
    }
    else {
      const newMessage: Message = {
        time: new Date().toLocaleTimeString().slice(0, -3),
        username: "YourUsername",
        message: input,
      };
    
      setMessages((prevMessages) => {
        const updatedMessages = [newMessage, ...prevMessages];
        // Keep only the latest 20 messages
        return updatedMessages.slice(0, 20);
      });
    }
    setInput("");
      if (isOpen) {
        onToggle();
      }
      setLastMessageTime(new Date());
      setWindowOpacity(1); // Reset opacity when a new message is sent
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "T" || event.key === "t") && !isOpen) {
        onToggle();
        setWindowOpacity(1); // Set opacity back to 1 when 'T' is pressed
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
      bg="rgba(0, 0, 0, 0.3)" // Adjust the outer box background for better visibility
      borderRadius="md"
      boxShadow="lg"
      overflow="hidden"
      opacity={windowOpacity}
      transition="opacity 0.5s ease"
    >
      <VStack
        className="chat-messages"
        overflowY="auto"
        p="3"
        spacing="3"
        flex="1"
        bg="transparent" // Make message background transparent
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
          <Textarea
            ref={inputRef as any} // Casting to 'any' to match the ref type to Textarea
            className="chat-input"
            variant="filled"
            placeholder="Type a message..."
            _placeholder={{ opacity: 1, color: "gray.500" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            size="md"
            bg="gray.700"
            color="white"
            borderRadius="md"
            border="0"
            autoFocus
            resize="none" // Prevent textarea from being resizable
            maxLength={250} // Set the max length to 250 characters
            mr="3"
          />
        </Box>
      )}
    </Box>
  );
};
