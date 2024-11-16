"use client";

import { useFormState } from "react-dom";
import { createLead, updateLead, type State } from "@/app/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { type MobilityAid, type Lead } from "@/types/lead";
import { AddressInput } from "@/components/ui/address-input";
import { useEffect, useState } from "react";

interface LeadFormProps {
  lead?: Lead;
  onSuccess?: () => void;
}

const initialState: State = {
  message: "",
  errors: undefined,
};

const mobilityAidOptions: MobilityAid[] = [
  "wheelchair",
  "walker",
  "motorized scooter",
  "other",
];

export function LeadForm({ lead, onSuccess }: LeadFormProps) {
  const [state, formAction] = useFormState(
    lead ? 
      (prevState: State, formData: FormData) => updateLead(lead.id, formData) : 
      createLead, 
    initialState
  );

  const [formData, setFormData] = useState({
    customerInfo: {
      firstName: lead?.firstName || "",
      lastName: lead?.lastName || "",
      email: lead?.email || "",
      phone: lead?.phone || "",
    },
    rampDetails: {
      knowRampLength: lead?.knowRampLength || false,
      rampLength: lead?.rampLength || null,
      knowRentalDuration: lead?.knowRentalDuration || false,
      rentalDuration: lead?.rentalDuration || null,
      installTimeframe: lead?.installTimeframe || "",
      mobilityAids: lead?.mobilityAids || [],
      otherAid: lead?.otherAid || null,
    },
    installAddress: lead?.installAddress || "",
    source: lead?.source || "Manual Entry",
    notes: lead?.notes || null,
  });

  useEffect(() => {
    if (state.message === 'Lead created successfully' || state.message === 'Lead updated successfully') {
      onSuccess?.();
    }
  }, [state.message, onSuccess]);

  const handleMobilityAidChange = (aid: MobilityAid) => {
    setFormData((prev) => ({
      ...prev,
      rampDetails: {
        ...prev.rampDetails,
        mobilityAids: prev.rampDetails.mobilityAids.includes(aid)
          ? prev.rampDetails.mobilityAids.filter((a) => a !== aid)
          : [...prev.rampDetails.mobilityAids, aid],
      },
    }));
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Customer Information */}
      <div className="space-y-4">
        <h3 className="font-semibold">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.customerInfo.firstName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customerInfo: { ...prev.customerInfo, firstName: e.target.value },
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.customerInfo.lastName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customerInfo: { ...prev.customerInfo, lastName: e.target.value },
                }))
              }
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.customerInfo.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customerInfo: { ...prev.customerInfo, email: e.target.value },
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.customerInfo.phone}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customerInfo: { ...prev.customerInfo, phone: e.target.value },
                }))
              }
              required
            />
          </div>
        </div>
      </div>

      {/* Install Address */}
      <div className="space-y-2">
        <Label htmlFor="installAddress">Install Address</Label>
        <AddressInput
          id="installAddress"
          name="installAddress"
          value={formData.installAddress}
          onAddressSelect={(place) => {
            setFormData((prev) => ({
              ...prev,
              installAddress: place.formatted_address || "",
            }))
          }}
          required
        />
      </div>

      {/* Ramp Details */}
      <div className="space-y-4">
        <h3 className="font-semibold">Ramp Details</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Install Timeframe</Label>
            <Select
              name="installTimeframe"
              value={formData.rampDetails.installTimeframe}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  rampDetails: { ...prev.rampDetails, installTimeframe: value },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASAP">As Soon As Possible</SelectItem>
                <SelectItem value="2 days">Within 2 days</SelectItem>
                <SelectItem value="3-5 days">3-5 days</SelectItem>
                <SelectItem value="1 week">In a week</SelectItem>
                <SelectItem value="over a week">Over a week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ramp Length */}
          <div className="space-y-2">
            <Label>Ramp Length Known?</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="knowRampLengthYes"
                  name="knowRampLength"
                  checked={formData.rampDetails.knowRampLength}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      rampDetails: {
                        ...prev.rampDetails,
                        knowRampLength: checked as boolean,
                      },
                    }))
                  }
                />
                <Label htmlFor="knowRampLengthYes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="knowRampLengthNo"
                  name="knowRampLength"
                  checked={!formData.rampDetails.knowRampLength}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      rampDetails: {
                        ...prev.rampDetails,
                        knowRampLength: !(checked as boolean),
                        rampLength: checked ? null : prev.rampDetails.rampLength,
                      },
                    }))
                  }
                />
                <Label htmlFor="knowRampLengthNo">No</Label>
              </div>
            </div>
            {formData.rampDetails.knowRampLength && (
              <Input
                name="rampLength"
                type="text"
                placeholder="Length in feet"
                value={formData.rampDetails.rampLength || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rampDetails: {
                      ...prev.rampDetails,
                      rampLength: e.target.value || null,
                    },
                  }))
                }
              />
            )}
          </div>

          {/* Rental Duration */}
          <div className="space-y-2">
            <Label>Rental Duration Known?</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="knowRentalDurationYes"
                  name="knowRentalDuration"
                  checked={formData.rampDetails.knowRentalDuration}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      rampDetails: {
                        ...prev.rampDetails,
                        knowRentalDuration: checked as boolean,
                      },
                    }))
                  }
                />
                <Label htmlFor="knowRentalDurationYes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="knowRentalDurationNo"
                  name="knowRentalDuration"
                  checked={!formData.rampDetails.knowRentalDuration}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      rampDetails: {
                        ...prev.rampDetails,
                        knowRentalDuration: !(checked as boolean),
                        rentalDuration: checked ? null : prev.rampDetails.rentalDuration,
                      },
                    }))
                  }
                />
                <Label htmlFor="knowRentalDurationNo">No</Label>
              </div>
            </div>
            {formData.rampDetails.knowRentalDuration && (
              <Input
                name="rentalDuration"
                type="text"
                placeholder="Duration in days"
                value={formData.rampDetails.rentalDuration || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rampDetails: {
                      ...prev.rampDetails,
                      rentalDuration: e.target.value || null,
                    },
                  }))
                }
              />
            )}
          </div>

          {/* Mobility Aids */}
          <div className="space-y-2">
            <Label>Mobility Aids</Label>
            <div className="grid grid-cols-2 gap-2">
              {mobilityAidOptions.map((aid) => (
                <div key={aid} className="flex items-center space-x-2">
                  <Checkbox
                    id={aid}
                    name="mobilityAids"
                    value={aid}
                    checked={formData.rampDetails.mobilityAids.includes(aid)}
                    onCheckedChange={() => handleMobilityAidChange(aid)}
                  />
                  <Label htmlFor={aid}>{aid}</Label>
                </div>
              ))}
            </div>
            {formData.rampDetails.mobilityAids.includes("other") && (
              <Input
                name="otherAid"
                placeholder="Specify other mobility aid"
                value={formData.rampDetails.otherAid || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rampDetails: {
                      ...prev.rampDetails,
                      otherAid: e.target.value || null,
                    },
                  }))
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              notes: e.target.value || null,
            }))
          }
          className="min-h-[100px]"
        />
      </div>

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

      <div className="flex justify-end space-x-2">
        <Button type="submit">
          {lead ? 'Update Lead' : 'Add Lead'}
        </Button>
      </div>
    </form>
  );
} 