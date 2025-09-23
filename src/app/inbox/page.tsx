import { InboxClient } from './inbox-client';

export default function InboxPage() {
    return (
        <div className="p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
                <p className="text-muted-foreground">You have new secure messages.</p>
            </header>
            <InboxClient />
        </div>
    );
}
