export interface User {
  id: number;
  username: string;
  role: string;
  daily_requests_remaining: number;
  bonus_requests: number;
  subscription_type: string | null;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}
