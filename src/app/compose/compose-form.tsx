'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getPinAdvice, sendEmail } from '@/app/actions';
import { Loader2, KeyRound, ShieldCheck } from 'lucide-react';
import { emailStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  to: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(1, { message: 'Subject cannot be empty.' }),
  body: z.string().min(1, { message: 'Email body cannot be empty.' }),
  pin: z.string().min(4, { message: 'PIN must be at least 4 characters long.' }),
});

type FormValues = z.infer<typeof formSchema>;

export function ComposeForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const [pinAdvice, setPinAdvice] = useState('');
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: '',
      subject: '',
      body: '',
      pin: '',
    },
  });
  
  const pinValue = form.watch('pin');

  useEffect(() => {
    if (pinValue.length < 2) {
      setPinAdvice('');
      return;
    }
    
    const handler = setTimeout(() => {
      setIsAdviceLoading(true);
      getPinAdvice(pinValue).then(result => {
        setPinAdvice(result.recommendations);
        setIsAdviceLoading(false);
      });
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [pinValue]);

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const result = await sendEmail(values);
      if (result.success) {
        emailStore.sendEmail({ from: 'me@example.com', ...values });
        toast({
          title: 'Email Sent!',
          description: 'Your secure email has been sent.',
        });
        form.reset();
        router.push('/inbox');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to send email. Please check the form.',
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient</FormLabel>
              <FormControl>
                <Input placeholder="recipient@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Your secure subject" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Compose your encrypted message..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Create PIN</FormLabel>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <FormControl>
                  <Input type="password" placeholder="••••" className="pl-10" {...field} />
                </FormControl>
              </div>
              <FormMessage />
              {(isAdviceLoading || pinAdvice) && (
                 <div
                    className="transition-opacity duration-300"
                 >
                    <FormDescription className="flex items-start gap-2 pt-2 text-sky-700 dark:text-sky-400">
                    <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>
                        {isAdviceLoading ? 'Analyzing PIN...' : pinAdvice}
                    </span>
                    </FormDescription>
                 </div>
              )}
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Encrypt & Send'
          )}
        </Button>
      </form>
    </Form>
  );
}
