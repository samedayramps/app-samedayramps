"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const businessFormSchema = z.object({
  warehouseAddress: z.string().min(1, {
    message: "Warehouse address is required.",
  }),
  baseDeliveryFee: z.coerce.number().min(0, {
    message: "Base delivery fee must be a positive number.",
  }),
  deliveryFeePerMile: z.coerce.number().min(0, {
    message: "Delivery fee per mile must be a positive number.",
  }),
  baseInstallFee: z.coerce.number().min(0, {
    message: "Base install fee must be a positive number.",
  }),
  installFeePerComponent: z.coerce.number().min(0, {
    message: "Install fee per component must be a positive number.",
  }),
  rentalRatePerFt: z.coerce.number().min(0, {
    message: "Rental rate per ft must be a positive number.",
  }),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

export function ProfileForm() {
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      warehouseAddress: "6008 Windridge Ln, Flower Mound, TX 75028, USA",
      baseDeliveryFee: 50,
      deliveryFeePerMile: 4,
      baseInstallFee: 50,
      installFeePerComponent: 50,
      rentalRatePerFt: 11,
    },
  });

  function onSubmit(data: BusinessFormValues) {
    // Handle form submission
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="warehouseAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warehouse Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter warehouse address" {...field} />
              </FormControl>
              <FormDescription>
                This is your business warehouse location.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="baseDeliveryFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Delivery Fee</FormLabel>
              <FormControl>
                <Input type="number" placeholder="50" {...field} />
              </FormControl>
              <FormDescription>
                The base fee charged for delivery.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryFeePerMile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Fee Per Mile</FormLabel>
              <FormControl>
                <Input type="number" placeholder="4" {...field} />
              </FormControl>
              <FormDescription>
                Additional fee charged per mile of delivery.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="baseInstallFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Install Fee</FormLabel>
              <FormControl>
                <Input type="number" placeholder="50" {...field} />
              </FormControl>
              <FormDescription>
                The base fee charged for installation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="installFeePerComponent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Install Fee Per Component</FormLabel>
              <FormControl>
                <Input type="number" placeholder="50" {...field} />
              </FormControl>
              <FormDescription>
                Additional fee charged per component installed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rentalRatePerFt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rental Rate Per Ft</FormLabel>
              <FormControl>
                <Input type="number" placeholder="11" {...field} />
              </FormControl>
              <FormDescription>
                The rate charged per foot for rentals.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Settings</Button>
      </form>
    </Form>
  );
} 