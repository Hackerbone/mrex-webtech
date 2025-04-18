export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
  };
  theme: "light" | "dark" | "system";
  language: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  settings: UserSettings;
}
