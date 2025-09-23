import { ComposeForm } from './compose-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function ComposePage() {
  return (
    <div className="flex min-h-full items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Compose Secure Email</CardTitle>
          <CardDescription>Encrypt your message with a PIN before sending.</CardDescription>
        </CardHeader>
        <CardContent>
          <ComposeForm />
        </CardContent>
      </Card>
    </div>
  );
}
