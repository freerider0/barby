'use client'

import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from 'react'

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

const accountTypes = [
  { label: 'Free', value: 'free' },
  { label: 'Pro', value: 'pro' },
] as const

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  dob: z.date({
    required_error: 'A date of birth is required.',
  }),
  language: z.string({
    required_error: 'Please select a language.',
  }),
  accountType: z.string({
    required_error: 'Please select an account type.',
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  name: '',
  accountType: 'free', // Default to free account
}

export function AccountForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  const [showCloseAccountDialog, setShowCloseAccountDialog] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState('')

  function onSubmit(data: AccountFormValues) {
    toast.success('You submitted the following values:', {
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  const handleUpgradeToPro = () => {
    // Here you would typically integrate with your payment provider
    toast.info('Redirecting to payment page...', {
      description: 'You will be redirected to complete your pro subscription.',
    })
    // Add your payment logic here
  }

  const handleCloseAccount = () => {
    if (confirmEmail !== 'user@example.com') { // Replace with actual user email
      toast.error('Email confirmation does not match')
      return
    }

    // Here you would typically make an API call to delete the account
    toast.error('Account closure initiated', {
      description: 'Your account will be permanently deleted after 30 days.',
    })
    setShowCloseAccountDialog(false)
    setConfirmEmail('')
    // Add your account deletion logic here
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Your name' {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed on your profile and in
                  emails.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='dob'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'MMM d, yyyy')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date: Date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Your date of birth is used to calculate your age.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='language'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Language</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        className={cn(
                          'w-[200px] justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? languages.find(
                              (language) => language.value === field.value
                            )?.label
                          : 'Select language'}
                        <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-[200px] p-0'>
                    <Command>
                      <CommandInput placeholder='Search language...' />
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {languages.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue('language', language.value)
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  language.value === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {language.label}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This is the language that will be used in the dashboard.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='accountType'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Account Type</FormLabel>
                <FormControl>
                  <div className='flex items-center gap-4'>
                    <Input 
                      readOnly 
                      value={field.value === 'pro' ? 'Pro Account' : 'Free Account'} 
                      className='w-[200px]'
                    />
                    {field.value !== 'pro' && (
                      <Button
                        type='button'
                        onClick={handleUpgradeToPro}
                        className='bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                      >
                        Upgrade to Pro
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  {field.value === 'pro' 
                    ? 'You are currently on a Pro plan with access to all features.' 
                    : 'Upgrade to Pro for access to advanced features and priority support.'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Update account</Button>

          <div className='border-t pt-6 mt-6'>
            <h3 className='text-lg font-semibold text-red-600 mb-3'>Danger Zone</h3>
            <p className='text-sm text-muted-foreground mb-4'>
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
              type='button'
              variant='destructive'
              onClick={() => setShowCloseAccountDialog(true)}
            >
              Close Account
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={showCloseAccountDialog} onOpenChange={setShowCloseAccountDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Close Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please read the following carefully:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">What happens when you close your account:</h4>
              <ul className="list-disc pl-4 text-sm text-muted-foreground">
                <li>Your profile and personal data will be permanently deleted</li>
                <li>All your saved preferences and settings will be removed</li>
                <li>You'll lose access to all premium features</li>
                <li>Your username will become available for others</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Alternative options:</h4>
              <ul className="list-disc pl-4 text-sm text-muted-foreground">
                <li>You can temporarily deactivate your account instead</li>
                <li>Downgrade to a free account if this is about costs</li>
                <li>Contact support if you're experiencing issues</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Type your email to confirm: user@example.com
              </label>
              <Input
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                You'll have 30 days to reactivate your account before it's permanently deleted.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCloseAccountDialog(false)
                setConfirmEmail('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCloseAccount}
              disabled={confirmEmail !== 'user@example.com'} // Replace with actual user email
            >
              Close Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
