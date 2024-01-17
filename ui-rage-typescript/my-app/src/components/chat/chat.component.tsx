import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import { makeToast } from "../../utils/components-used/toast";
import { ChatEvents } from "../../utils/chat/events.constants";
import { ChatEventInfo, ChatMessage } from "../../utils/chat/model";
import { ChatMessageComponent } from "./components/chat-message/chat-message.component";

export const ChatWindow = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const [windowOpacity, setWindowOpacity] = useState(1);
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  let rpc: any = null;
  if ("rpc" in window && "callClient" in window.rpc) {
    rpc = window.rpc;
  }

  // rpc function that is called from client side for adding the message
  rpc.register(ChatEvents.CEF_RECEIVE_MESSAGE, (chatMessageJSON: string) => {
    const chatMessage: ChatMessage = JSON.parse(chatMessageJSON);
    setChatMessages((prevMessages) => {
      const updatedMessages = [chatMessage, ...prevMessages];
      // Keep only the latest 20 messages
      return updatedMessages.slice(0, 20);
    });
  })
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

    if (input.length > 250) {
      console.log("Message cannot exceed 250 characters.");
        makeToast(
          rpc,
          toast,
          "Chat",
          "Message cannot exceed 250 characters.",
          "error"
        );
      return;
    }

    if (input.startsWith("/")) {
        let chatEventInfo: ChatEventInfo = await rpc.callClient(ChatEvents.CLIENT_CHAT_COMMAND, input);
        if(chatEventInfo !== undefined) {
          makeToast(window.rpc, toast, chatEventInfo.title, chatEventInfo.description, chatEventInfo.status);
        }
    }
    else {
        await rpc.callClient(ChatEvents.CLIENT_CHAT_MESSAGE, input);
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
        // TODO set player in client side to stop moving
      } else if (event.key === "Escape" && isOpen) {
        // TODO set player in client side to move again
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
        {chatMessages.map((chatMessage, index) => (
          <ChatMessageComponent key={index} chatMessage={chatMessage}
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
