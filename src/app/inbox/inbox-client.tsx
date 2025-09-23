'use client';

import { useState, useSyncExternalStore } from 'react';
import { emailStore, type Email } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, Mail, MailOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export function InboxClient() {
  const emails = useSyncExternalStore(emailStore.subscribe, emailStore.getState);
  
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [pin, setPin] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [unlockStep, setUnlockStep] = useState<'pin' | 'passcode' | 'unlocked'>('pin');
  const [error, setError] = useState('');

  const { toast } = useToast();

  const handleOpenEmail = (email: Email) => {
    setSelectedEmail(email);
    if (email.passcode) {
      setUnlockStep('passcode');
    } else {
      setUnlockStep('pin');
    }
  };

  const handleCloseDialog = () => {
    setSelectedEmail(null);
    setPin('');
    setNewPasscode('');
    setError('');
  };

  const handlePinSubmit = () => {
    if (selectedEmail && pin === selectedEmail.pin) {
      setError('');
      if (!selectedEmail.isRead) {
        emailStore.markAsRead(selectedEmail.id);
      }
      setUnlockStep('passcode');
    } else {
      setError('Incorrect PIN. Please try again.');
    }
  };

  const handlePasscodeCreate = () => {
      if (selectedEmail && newPasscode.length >= 4) {
        emailStore.updatePasscode(selectedEmail.id, newPasscode);
        setError('');
        setUnlockStep('unlocked');
      } else {
          setError('Passcode must be at least 4 characters long.');
      }
  };

  const handlePasscodeSubmit = () => {
    if (selectedEmail && newPasscode === selectedEmail.passcode) {
      setError('');
      setUnlockStep('unlocked');
    } else {
      setError('Incorrect passcode. Please try again.');
    }
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {emails.map((email) => (
          <Card key={email.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleOpenEmail(email)}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            {email.isRead ? <MailOpen className="text-muted-foreground size-5" /> : <Mail className="text-primary size-5" />}
                            <span>{email.subject}</span>
                        </CardTitle>
                        <CardDescription>From: {email.from}</CardDescription>
                    </div>
                    {!email.isRead && <Badge variant="default" className="bg-accent text-accent-foreground">New</Badge>}
                </div>
            </CardHeader>
            <CardFooter className="text-xs text-muted-foreground justify-between">
                <span>Received {formatDistanceToNow(new Date(email.timestamp), { addSuffix: true })}</span>
                <div className="flex items-center gap-1">
                    <Lock className="size-3" />
                    <span>Secured</span>
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedEmail} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent>
          {unlockStep !== 'unlocked' && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Lock className="text-primary" />
                    Unlock Secure Message
                </DialogTitle>
                <DialogDescription>
                    {unlockStep === 'pin' && 'Enter the PIN to view this email.'}
                    {unlockStep === 'passcode' && !selectedEmail?.passcode && 'Create a new passcode for future access.'}
                    {unlockStep === 'passcode' && selectedEmail?.passcode && 'Enter your passcode to view this email.'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {unlockStep === 'pin' && (
                    <Input type="password" placeholder="Enter PIN" value={pin} onChange={(e) => setPin(e.target.value)} />
                )}
                {unlockStep === 'passcode' && (
                    <Input type="password" placeholder={selectedEmail?.passcode ? "Enter your passcode" : "Create new passcode"} value={newPasscode} onChange={(e) => setNewPasscode(e.target.value)} />
                )}
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                {unlockStep === 'pin' && <Button onClick={handlePinSubmit}>Unlock</Button>}
                {unlockStep === 'passcode' && !selectedEmail?.passcode && <Button onClick={handlePasscodeCreate}>Set Passcode & View</Button>}
                {unlockStep === 'passcode' && selectedEmail?.passcode && <Button onClick={handlePasscodeSubmit}>View Email</Button>}
              </DialogFooter>
            </>
          )}

          {unlockStep === 'unlocked' && selectedEmail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Unlock className="text-green-500" />
                    {selectedEmail.subject}
                </DialogTitle>
                <DialogDescription>From: {selectedEmail.from}</DialogDescription>
              </DialogHeader>
              <div className="py-4 max-h-[50vh] overflow-y-auto">
                <p className="whitespace-pre-wrap">{selectedEmail.body}</p>
              </div>
              <DialogFooter>
                 <Button onClick={handleCloseDialog}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
