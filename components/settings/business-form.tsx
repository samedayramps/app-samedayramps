"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateBusinessSettings } from "@/app/actions/settings";
import type { BusinessSettings } from "@/app/actions/settings";
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
import { AddressInput } from "@/components/ui/address-input";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

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

type FormData = z.infer<typeof businessFormSchema>;

export function BusinessForm({ initialData }: { initialData: BusinessSettings }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: initialData,
  });

  async function onSubmit(data: FormData) {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      const result = await updateBusinessSettings(formData);
      
      if (result.message) {
        toast({
          title: "Success",
          description: result.message,
        });
        router.refresh();
      } else if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
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
                <AddressInput 
                  placeholder="Enter warehouse address"
                  onAddressSelect={(place) => {
                    if (place.formatted_address) {
                      field.onChange(place.formatted_address);
                    }
                  }}
                  {...field}
                />
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