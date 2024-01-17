export interface ChatEventInfo {
    title: string;
    status: "success" | "error" | "warning" | "info" | undefined,
    description: string;
}

export interface ChatMessage {
    playerId: number;
    playerName?: string;
    time: string;
    message: string;
}