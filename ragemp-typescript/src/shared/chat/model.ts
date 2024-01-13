export interface ChatEventInfo {
    title: string;
    status: "success" | "error" | "warning" | "info" | undefined,
    description: string;
}