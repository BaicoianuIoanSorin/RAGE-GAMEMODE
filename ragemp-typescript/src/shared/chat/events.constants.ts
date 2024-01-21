export enum ChatEvents {
    CLIENT_TYPES_MESSAGE = 'client:typesMessage',
    CLIENT_STOPPED_TYPING_MESSAGE = 'client:stoppedTyping',

    CLIENT_CHAT_COMMAND = 'client:chatCommand',
    CLIENT_CHAT_MESSAGE = 'chat:chatMessage',
    SERVER_CHAT_MESSAGE = 'server:chatMessage',
    
    CEF_RECEIVE_MESSAGE = 'cef:receiveMessage',
    CLIENT_RECEIVE_MESSAGE = 'client:receiveMessage',

}