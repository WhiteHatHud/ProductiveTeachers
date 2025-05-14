import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const paymentSchema = z.object({
  cardName: z.string().min(2, "Name on card is required"),
  cardNumber: z
    .string()
    .min(16, "Card number must be 16 digits")
    .max(19, "Card number must be at most 19 digits")
    .regex(/^[0-9\s-]+$/, "Card number must contain only digits"),
  expiryMonth: z.string().min(1, "Expiry month is required"),
  expiryYear: z.string().min(1, "Expiry year is required"),
  cvv: z
    .string()
    .min(3, "CVV must be 3-4 digits")
    .max(4, "CVV must be 3-4 digits")
    .regex(/^[0-9]+$/, "CVV must contain only digits"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  recommended?: boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic-monthly",
    name: "Basic",
    price: 9.99,
    billingCycle: "monthly",
    features: [
      "Up to 3 classes",
      "Basic attendance tracking",
      "Email notifications",
      "Export to CSV",
    ],
  },
  {
    id: "standard-monthly",
    name: "Standard",
    price: 19.99,
    billingCycle: "monthly",
    features: [
      "Up to 10 classes",
      "Advanced attendance analytics",
      "WhatsApp notifications",
      "Google Sheets integration",
      "Email support",
    ],
    recommended: true,
  },
  {
    id: "premium-monthly",
    name: "Premium",
    price: 29.99,
    billingCycle: "monthly",
    features: [
      "Unlimited classes",
      "Advanced analytics & reporting",
      "Priority support",
      "Custom integrations",
      "API access",
      "Dedicated account manager",
    ],
  },
  {
    id: "basic-yearly",
    name: "Basic",
    price: 99.99,
    billingCycle: "yearly",
    features: [
      "Up to 3 classes",
      "Basic attendance tracking",
      "Email notifications",
      "Export to CSV",
      "Save 16% with annual billing",
    ],
  },
  {
    id: "standard-yearly",
    name: "Standard",
    price: 199.99,
    billingCycle: "yearly",
    features: [
      "Up to 10 classes",
      "Advanced attendance analytics",
      "WhatsApp notifications",
      "Google Sheets integration",
      "Email support",
      "Save 16% with annual billing",
    ],
    recommended: true,
  },
  {
    id: "premium-yearly",
    name: "Premium",
    price: 299.99,
    billingCycle: "yearly",
    features: [
      "Unlimited classes",
      "Advanced analytics & reporting",
      "Priority support",
      "Custom integrations",
      "API access",
      "Dedicated account manager",
      "Save 16% with annual billing",
    ],
  },
];

const PaymentPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [selectedPlan, setSelectedPlan] = useState<string>("standard-monthly");
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state || {};

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    },
  });

  const onSubmit = async (data: PaymentFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock payment processing - replace with actual payment logic
      console.log("Payment data:", data);
      console.log("Selected plan:", selectedPlan);
      console.log("User data:", userData);

      // Simulate successful payment processing
      setTimeout(() => {
        setSuccess(true);

        // Store user info in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...userData,
            subscriptionPlan: selectedPlan,
            subscriptionActive: true,
          }),
        );

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }, 1500);
    } catch (err) {
      setError("An error occurred while processing your payment");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBillingCycleChange = (value: string) => {
    const cycle = value as "monthly" | "yearly";
    setBillingCycle(cycle);

    // Update selected plan to match the billing cycle
    const currentPlanName = selectedPlan.split("-")[0];
    setSelectedPlan(`${currentPlanName}-${cycle}`);
  };

  const filteredPlans = subscriptionPlans.filter(
    (plan) => plan.billingCycle === billingCycle,
  );

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      value: month.toString().padStart(2, "0"),
      label: month.toString().padStart(2, "0"),
    };
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear + i;
    return { value: year.toString(), label: year.toString() };
  });

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-center">
              Thank you for subscribing to our service.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p>You will be redirected to the dashboard shortly...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Choose Your Subscription
          </CardTitle>
          <CardDescription className="text-center">
            Select a plan that works for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <Tabs
                value={billingCycle}
                onValueChange={handleBillingCycleChange}
                className="w-[400px]"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly (Save 16%)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-4 cursor-pointer relative ${selectedPlan === plan.id ? "border-primary ring-2 ring-primary ring-opacity-50" : "border-gray-200"}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs py-1 px-3 rounded-full">
                      Recommended
                    </div>
                  )}
                  <div className="text-lg font-bold mb-2">{plan.name}</div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold">${plan.price}</span>
                    <span className="text-gray-500">
                      /{plan.billingCycle === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={selectedPlan === plan.id ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <CreditCard className="mr-2 h-5 w-5" /> Payment Details
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="cardName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name on Card</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) => {
                            // Format card number with spaces
                            const value = e.target.value
                              .replace(/\s+/g, "")
                              .replace(/[^0-9]/g, "");
                            const formattedValue = value
                              .replace(/(.{4})/g, "$1 ")
                              .trim();
                            field.onChange(formattedValue);
                          }}
                          maxLength={19}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Month</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiryYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Year</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year.value} value={year.value}>
                                {year.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123"
                            disabled={isLoading}
                            maxLength={4}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? "Processing..."
                    : `Subscribe for $${filteredPlans.find((p) => p.id === selectedPlan)?.price}/${billingCycle === "monthly" ? "mo" : "yr"}`}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center text-xs text-muted-foreground">
          Secure payment processing. Your card information is encrypted.
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentPage;
