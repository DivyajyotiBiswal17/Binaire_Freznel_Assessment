import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { authService } from "@/auth/AuthService";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => authService.onChange((u) => { setUser(u); setReady(true); }), []);
  return { user, ready };
}