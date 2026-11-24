import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type User = {
  id: string;
  name: string;
  identifier: string;
  email?: string;
  phone?: string;
  provider: "email" | "phone";
};

type StoredAccount = User & { password: string };

type LoginCredentials = { identifier: string; password: string };

type RegisterCredentials = {
  name: string;
  identifier: string;
  password: string;
  provider: "email" | "phone";
};

type AuthContextValue = {
  user: User | null;
  isReady: boolean;
  isAuthenticating: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateName: (name: string) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (identifier: string, newPassword: string) => Promise<void>;
};

const ACCOUNTS_KEY = "princefilms.accounts.v1";
const SESSION_KEY = "princefilms.session.v1";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

function readAccounts(): StoredAccount[] {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is StoredAccount => isRecord(item) && typeof item.identifier === "string");
  } catch {
    return [];
  }
}

function readSession(): User | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || typeof parsed.id !== "string") return null;
    return parsed as User;
  } catch {
    return null;
  }
}

const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Demo authentication persisted on this device only. Passwords never leave
 * localStorage, so this is deliberately local: it exists to gate playback and
 * keep a viewer's saved titles, not to model a production identity provider.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    setUser(readSession());
    setIsReady(true);
  }, []);

  const persistSession = useCallback((next: User | null) => {
    setUser(next);
    try {
      if (next) window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(SESSION_KEY);
    } catch {
      // The session lives in memory if storage is unavailable.
    }
  }, []);

  const login = useCallback(
    async ({ identifier, password }: LoginCredentials) => {
      setIsAuthenticating(true);
      try {
        await pause(400);
        const value = identifier.trim();
        if (!value) throw new Error("Enter the email or phone number you registered with.");
        if (!password) throw new Error("Enter your password.");

        const account = readAccounts().find(
          (candidate) => candidate.identifier.toLowerCase() === value.toLowerCase(),
        );
        if (!account) throw new Error("No account matches that email or phone on this device.");
        if (account.password !== password) throw new Error("That password does not match this account.");

        persistSession({
          id: account.id,
          name: account.name,
          identifier: account.identifier,
          email: account.email,
          phone: account.phone,
          provider: account.provider,
        });
      } finally {
        setIsAuthenticating(false);
      }
    },
    [persistSession],
  );

  const register = useCallback(
    async ({ name, identifier, password, provider }: RegisterCredentials) => {
      setIsAuthenticating(true);
      try {
        await pause(500);
        const value = identifier.trim();
        if (!name.trim()) throw new Error("Enter the name that should appear on your account.");
        if (!value) throw new Error("Enter an email address or phone number.");
        if (provider === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          throw new Error("That email address is missing a domain.");
        }
        if (password.length < 6) throw new Error("Use at least 6 characters for the password.");

        const accounts = readAccounts();
        if (accounts.some((candidate) => candidate.identifier.toLowerCase() === value.toLowerCase())) {
          throw new Error("An account with that email or phone already exists on this device.");
        }

        const account: StoredAccount = {
          id: `pf_${Math.random().toString(36).slice(2, 10)}`,
          name: name.trim(),
          identifier: value,
          email: provider === "email" ? value : undefined,
          phone: provider === "phone" ? value : undefined,
          provider,
          password,
        };

        try {
          window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]));
        } catch {
          throw new Error("This browser blocked local storage, so the account could not be saved.");
        }

        persistSession({
          id: account.id,
          name: account.name,
          identifier: account.identifier,
          email: account.email,
          phone: account.phone,
          provider: account.provider,
        });
      } finally {
        setIsAuthenticating(false);
      }
    },
    [persistSession],
  );

  const logout = useCallback(() => persistSession(null), [persistSession]);

  const updateName = useCallback((name: string) => {
    if (!user || !name.trim()) throw new Error("Name is required.");
    const accounts = readAccounts();
    const account = accounts.find((item) => item.id === user.id);
    if (!account) throw new Error("This account could not be found on this device.");
    const updatedAccounts = accounts.map((item) =>
      item.id === user.id ? { ...item, name: name.trim() } : item,
    );
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
    persistSession({ ...user, name: name.trim() });
  }, [user, persistSession]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error("Please sign in again.");
    if (newPassword.length < 6) throw new Error("Use at least 6 characters for the new password.");
    const accounts = readAccounts();
    const account = accounts.find((item) => item.id === user.id);
    if (!account) throw new Error("This account could not be found on this device.");
    if (account.password !== currentPassword) throw new Error("Your current password is incorrect.");
    const updatedAccounts = accounts.map((item) =>
      item.id === user.id ? { ...item, password: newPassword } : item,
    );
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
  }, [user]);

  const value = useMemo(
    () => ({ user, isReady, isAuthenticating, login, register, logout, updateName, changePassword }),
    [user, isReady, isAuthenticating, login, register, logout, updateName, changePassword, resetPassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}
