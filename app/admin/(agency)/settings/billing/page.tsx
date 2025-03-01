'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { loadStripe } from '@stripe/stripe-js'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import planData from './plans.json'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

// Payment method type definition
interface PaymentMethod {
  id: string
  type: string
  card?: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
  isDefault: boolean
}

// Plan type definition
interface Plan {
  id: string
  name: string
  description: string
  price: number
  interval: string
  features: string[]
  recommended: boolean
  stripePriceId: string
}

export default function BillingPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [plans, setPlans] = useState<Plan[]>(planData.plans)
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)

  // Set current plan on component mount
  useEffect(() => {
    const current = plans.find(plan => plan.id === planData.currentPlan) || null
    setCurrentPlan(current)
  }, [plans])

  // Fetch payment methods from Stripe
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch('/api/stripe/payment-methods')
        if (!response.ok) throw new Error('Failed to fetch payment methods')
        
        const data = await response.json()
        setPaymentMethods(data.paymentMethods)
      } catch (error) {
        console.error('Error fetching payment methods:', error)
        // Fallback to demo data if API fails
        setPaymentMethods([
          {
            id: 'pm_demo1',
            type: 'card',
            card: {
              brand: 'visa',
              last4: '4242',
              exp_month: 12,
              exp_year: 2025
            },
            isDefault: true
          },
          {
            id: 'pm_demo2',
            type: 'card',
            card: {
              brand: 'mastercard',
              last4: '5678',
              exp_month: 8,
              exp_year: 2024
            },
            isDefault: false
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentMethods()
  }, [])

  // Set a payment method as default
  const setDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      const response = await fetch('/api/stripe/set-default-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId }),
      })

      if (!response.ok) throw new Error('Failed to set default payment method')
      
      // Update local state
      setPaymentMethods(methods => 
        methods.map(method => ({
          ...method,
          isDefault: method.id === paymentMethodId
        }))
      )
    } catch (error) {
      console.error('Error setting default payment method:', error)
    }
  }

  // Add a new payment method
  const addPaymentMethod = async () => {
    try {
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to initialize')

      // Using the correct Stripe API method for adding payment methods
      // This is a simplified example - in a real app, you'd create a SetupIntent on the server
      // and use stripe.confirmCardSetup() with Elements
      window.location.href = '/api/stripe/create-setup-intent?redirect=' + encodeURIComponent(window.location.href)
    } catch (error) {
      console.error('Error adding payment method:', error)
    }
  }

  // Handle plan change
  const changePlan = async (planId: string) => {
    try {
      const plan = plans.find(p => p.id === planId)
      if (!plan) throw new Error('Plan not found')

      const response = await fetch('/api/stripe/change-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          planId: planId,
          stripePriceId: plan.stripePriceId 
        }),
      })

      if (!response.ok) throw new Error('Failed to change plan')
      
      // Refresh the page to show updated plan
      window.location.reload()
    } catch (error) {
      console.error('Error changing plan:', error)
    }
  }

  // Handle subscription cancellation
  const cancelSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to cancel subscription')
      
      // Refresh the page to show updated subscription status
      window.location.reload()
    } catch (error) {
      console.error('Error cancelling subscription:', error)
    }
  }

  // Get card icon based on brand
  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return (
          <div className="bg-blue-100 p-2 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </div>
        )
      case 'mastercard':
        return (
          <div className="bg-red-100 p-2 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="bg-gray-100 p-2 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </div>
        )
    }
  }

  // Render check icon for features
  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  )

  if (!currentPlan) {
    return <div className="flex justify-center py-12">Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <Button variant="outline">Billing History</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are currently on the {currentPlan.name} plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{currentPlan.name} Plan</h2>
                <Badge className="bg-green-500">Active</Badge>
              </div>
              <p className="text-muted-foreground mt-1">Renews on {planData.renewalDate}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">${currentPlan.price.toFixed(2)}</p>
              <p className="text-muted-foreground">per {currentPlan.interval}</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <h3 className="font-medium">Plan Features</h3>
            <ul className="space-y-2">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Cancel Subscription</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel your subscription? You will lose access to all {currentPlan.name} features at the end of your current billing period.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, keep my subscription</AlertDialogCancel>
                <AlertDialogAction onClick={cancelSubscription} className="bg-destructive text-destructive-foreground">
                  Yes, cancel subscription
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>Upgrade Plan</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upgrade Your Plan</DialogTitle>
                <DialogDescription>
                  Choose a plan that best fits your needs.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {plans
                  .filter(plan => plan.price > currentPlan.price)
                  .map(plan => (
                    <div key={plan.id} className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`${plan.id}-plan-upgrade`}
                          name="plan-upgrade"
                          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                          onChange={() => setSelectedPlan(plan.id)}
                          checked={selectedPlan === plan.id}
                        />
                        <label htmlFor={`${plan.id}-plan-upgrade`} className="text-sm font-medium">
                          {plan.name} Plan - ${plan.price.toFixed(2)}/{plan.interval}
                        </label>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        {plan.features.join(', ')}
                      </p>
                    </div>
                  ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedPlan(null)}>Cancel</Button>
                <Button 
                  onClick={() => selectedPlan && changePlan(selectedPlan)}
                  disabled={!selectedPlan}
                >
                  Upgrade
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
      
      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="plans">Available Plans</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map(plan => (
              <Card key={plan.id} className={plan.id === currentPlan.id ? "border-2 border-primary" : ""}>
                <CardHeader>
                  {plan.id === currentPlan.id ? (
                    <div className="flex justify-between items-center">
                      <CardTitle>{plan.name}</CardTitle>
                      <Badge>Current</Badge>
                    </div>
                  ) : (
                    <CardTitle>{plan.name}</CardTitle>
                  )}
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold">${plan.price.toFixed(2)}</p>
                    <p className="text-muted-foreground">per {plan.interval}</p>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckIcon />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {plan.id === currentPlan.id ? (
                    <Button className="w-full" disabled>Current Plan</Button>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">Select Plan</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {plan.price > currentPlan.price 
                              ? `Upgrade to ${plan.name} Plan` 
                              : `Downgrade to ${plan.name} Plan`}
                          </DialogTitle>
                          <DialogDescription>
                            {plan.price > currentPlan.price 
                              ? `Are you sure you want to upgrade to the ${plan.name} plan? You will be charged $${plan.price.toFixed(2)} per ${plan.interval}.`
                              : `Are you sure you want to downgrade to the ${plan.name} plan? You will lose access to some features.`}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4">
                          <Button variant="outline">Cancel</Button>
                          <Button onClick={() => changePlan(plan.id)}>
                            {plan.price > currentPlan.price ? 'Confirm Upgrade' : 'Confirm Downgrade'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : paymentMethods.length > 0 ? (
                paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {method.card && getCardIcon(method.card.brand)}
                      <div>
                        <p className="font-medium">
                          {method.card ? `${method.card.brand.charAt(0).toUpperCase() + method.card.brand.slice(1)} ending in ${method.card.last4}` : 'Unknown payment method'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {method.card ? `Expires ${method.card.exp_month.toString().padStart(2, '0')}/${method.card.exp_year}` : ''}
                        </p>
                      </div>
                    </div>
                    {method.isDefault ? (
                      <Badge>Default</Badge>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setDefaultPaymentMethod(method.id)}
                      >
                        Set as default
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No payment methods found</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Payment Method</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>
                      Add a new credit or debit card to your account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    {/* This would be replaced with a Stripe Elements component in a real implementation */}
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground mb-4">Secure payment form will appear here</p>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Card Number</label>
                          <div className="mt-1 border rounded-md p-2">4242 4242 4242 4242</div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="text-sm font-medium">Expiration</label>
                            <div className="mt-1 border rounded-md p-2">12/25</div>
                          </div>
                          <div className="w-20">
                            <label className="text-sm font-medium">CVC</label>
                            <div className="mt-1 border rounded-md p-2">123</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={addPaymentMethod}>Add Card</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your past invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border-b">
                  <div>
                    <p className="font-medium">{currentPlan.name} Plan - Monthly</p>
                    <p className="text-sm text-muted-foreground">September 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${currentPlan.price.toFixed(2)}</p>
                    <Badge variant="outline" className="text-green-600">Paid</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border-b">
                  <div>
                    <p className="font-medium">{currentPlan.name} Plan - Monthly</p>
                    <p className="text-sm text-muted-foreground">August 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${currentPlan.price.toFixed(2)}</p>
                    <Badge variant="outline" className="text-green-600">Paid</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border-b">
                  <div>
                    <p className="font-medium">{currentPlan.name} Plan - Monthly</p>
                    <p className="text-sm text-muted-foreground">July 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${currentPlan.price.toFixed(2)}</p>
                    <Badge variant="outline" className="text-green-600">Paid</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">Basic Plan - Monthly</p>
                    <p className="text-sm text-muted-foreground">June 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$9.99</p>
                    <Badge variant="outline" className="text-green-600">Paid</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Download All Invoices</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 