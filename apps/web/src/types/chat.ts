export interface RoomCardData {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  view: string;
  tagline: string;
}

export interface ActionButton {
  label: string;
  url?: string;
  actionType: "navigate" | "book" | "prompt";
  promptQuery?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "concierge";
  text: string;
  timestamp: string;
  roomCard?: RoomCardData;
  actionButtons?: ActionButton[];
  suggestions?: string[];
}

export interface QuickPrompt {
  id: string;
  label: string;
  query: string;
}
