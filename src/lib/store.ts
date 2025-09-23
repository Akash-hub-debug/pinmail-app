export type Email = {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  pin: string;
  passcode?: string;
  isRead: boolean;
  timestamp: number;
};

let emails: Email[] = [
    {
      id: '1',
      from: 'demo@example.com',
      to: 'you@example.com',
      subject: 'Welcome to PinMail',
      body: 'This is a sample secure email. The PIN is "1234". Try to open it!',
      pin: '1234',
      isRead: false,
      timestamp: Date.now() - 1000 * 60 * 5,
    },
    {
      id: '2',
      from: 'security@pinmail.dev',
      to: 'you@example.com',
      subject: 'Your Weekly Security Report',
      body: 'All systems are secure. Your emails are protected. The PIN is "4321".',
      pin: '4321',
      isRead: false,
      timestamp: Date.now(),
    },
];

type Listener = () => void;
const listeners = new Set<Listener>();

const notify = () => {
    listeners.forEach(l => l());
};

export const emailStore = {
    subscribe: (listener: Listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
    
    getState: () => emails.sort((a, b) => b.timestamp - a.timestamp),

    sendEmail: (email: Omit<Email, 'id' | 'isRead' | 'timestamp'>) => {
        emails = [{ ...email, id: new Date().toISOString(), isRead: false, timestamp: Date.now() }, ...emails];
        notify();
    },

    updatePasscode: (id: string, passcode: string) => {
        emails = emails.map((email) =>
            email.id === id ? { ...email, passcode } : email
        );
        notify();
    },

    markAsRead: (id: string) => {
        emails = emails.map((email) =>
            email.id === id ? { ...email, isRead: true } : email
        );
        notify();
    }
};
