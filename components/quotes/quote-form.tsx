"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { createQuote } from "@/app/actions/quotes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Lead } from "@/types/lead";
import { type State } from "@/app/actions/quotes";
import { calculateDeliveryDistance } from "@/lib/distance";
import { getBusinessSettings } from "@/app/actions/settings";

interface QuoteFormProps {
  lead: Lead;
  settings: Awaited<ReturnType<typeof getBusinessSettings>>;
  onSuccess?: () => void;
}

export function QuoteForm({ lead, settings, onSuccess }: QuoteFormProps) {
  const [state, formAction] = useFormState(
    async (prevState: State, formData: FormData) => {
      const result = await createQuote(prevState, formData);
      if (!result.errors && onSuccess) {
        onSuccess();
      }
      return result;
    },
    {
      message: "",
      errors: undefined,
    }
  );

  const [specs, setSpecs] = useState({
    rampLength: lead.rampLength || "",
    platforms: 0,
    distance: 0,
  });

  const [distanceError, setDistanceError] = useState<string | null>(null);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(true);

  // Update distance calculation with better error handling
  useEffect(() => {
    async function getDistance() {
      setIsCalculatingDistance(true);
      setDistanceError(null);
      
      try {
        const distance = await calculateDeliveryDistance(lead.installAddress);
        if (distance === 0) {
          setDistanceError("Could not calculate delivery distance. Please verify the installation address.");
        } else {
          setSpecs(prev => ({
            ...prev,
            distance
          }));
        }
      } catch (error) {
        console.error("Distance calculation error:", error);
        setDistanceError("Failed to calculate delivery distance. Please try again later.");
      } finally {
        setIsCalculatingDistance(false);
      }
    }
    
    getDistance();
  }, [lead.installAddress]);

  // Calculate total price using business settings
  const calculatePrice = () => {
    // Ramp rental cost
    const rampRentalPrice = Number(specs.rampLength) * settings.rentalRatePerFt;
    
    // Platform cost
    const platformPrice = specs.platforms * settings.installFeePerComponent;
    
    // Delivery cost (base fee + mileage)
    const deliveryPrice = settings.baseDeliveryFee + (specs.distance * settings.deliveryFeePerMile);
    
    // Installation cost (base fee + per component)
    const installationPrice = settings.baseInstallFee + 
      ((specs.platforms + 1) * settings.installFeePerComponent); // +1 for the ramp itself

    return rampRentalPrice + platformPrice + deliveryPrice + installationPrice;
  };

  const totalPrice = calculatePrice();

  return (
    <form action={formAction}>
      <input type="hidden" name="leadId" value={lead.id} />
      <input type="hidden" name="price" value={totalPrice} />
      
      <Card>
        <CardHeader>
          <CardTitle>Generate Quote</CardTitle>
          <CardDescription>
            Configure ramp specifications and generate a quote for {lead.firstName} {lead.lastName}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Ramp Length */}
          <div className="space-y-2">
            <Label htmlFor="rampLength">Ramp Length (ft)</Label>
            <Input
              id="rampLength"
              name="rampLength"
              type="number"
              step="0.1"
              value={specs.rampLength}
              onChange={(e) => setSpecs(prev => ({
                ...prev,
                rampLength: e.target.value
              }))}
              required
            />
          </div>

          {/* Platforms */}
          <div className="space-y-2">
            <Label htmlFor="platforms">Number of Platforms</Label>
            <Input
              id="platforms"
              name="platforms"
              type="number"
              min="0"
              value={specs.platforms}
              onChange={(e) => setSpecs(prev => ({
                ...prev,
                platforms: parseInt(e.target.value) || 0
              }))}
            />
          </div>

          {/* Delivery Distance */}
          <div className="space-y-2">
            <Label htmlFor="distance">Total Travel Distance (miles)</Label>
            <Input
              id="distance"
              name="distance"
              type="number"
              step="0.1"
              value={isCalculatingDistance ? "Calculating..." : specs.distance}
              readOnly
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              Includes round trips for both installation and removal
            </p>
            {distanceError && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{distanceError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any special requirements or notes..."
            />
          </div>

          {/* Price Breakdown */}
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt>Ramp Rental ({specs.rampLength}ft @ ${settings.rentalRatePerFt}/ft)</dt>
                  <dd>${(Number(specs.rampLength) * settings.rentalRatePerFt).toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Platforms ({specs.platforms} @ ${settings.installFeePerComponent}/ea)</dt>
                  <dd>${(specs.platforms * settings.installFeePerComponent).toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Delivery (Base: ${settings.baseDeliveryFee} + {specs.distance} miles @ ${settings.deliveryFeePerMile}/mi)</dt>
                  <dd>${(settings.baseDeliveryFee + (specs.distance * settings.deliveryFeePerMile)).toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Installation (Base: ${settings.baseInstallFee} + {specs.platforms + 1} components)</dt>
                  <dd>${(settings.baseInstallFee + ((specs.platforms + 1) * settings.installFeePerComponent)).toFixed(2)}</dd>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <dt>Total</dt>
                  <dd>${totalPrice.toFixed(2)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Error Messages */}
          {state.errors && (
            <div className="text-red-500 text-sm">
              {Object.entries(state.errors).map(([key, errors]) => (
                <div key={key}>
                  {errors?.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button type="submit" name="action" value="save">
            Save Quote
          </Button>
          <Button type="submit" name="action" value="send">
            Send Quote
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
} 