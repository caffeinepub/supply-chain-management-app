import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSubmitQuotation, useGetAllQuotationRequests, useGetAllVendors } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { RequestStatus } from '../backend';
import { toast } from 'sonner';

interface QuotationFormData {
  unitPrice: string;
  deliveryTimeline: string;
  termsAndConditions: string;
  validityPeriod: string;
}

export default function QuotationSubmissionForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<QuotationFormData>();
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const { data: requests, isLoading: requestsLoading } = useGetAllQuotationRequests();
  const { data: vendors, isLoading: vendorsLoading } = useGetAllVendors();
  const submitQuotation = useSubmitQuotation();

  const unitPrice = watch('unitPrice');
  const selectedRequest = requests?.find((r) => r.id === selectedRequestId);
  const totalPrice = unitPrice && selectedRequest ? parseFloat(unitPrice) * Number(selectedRequest.quantity) : 0;

  const onSubmit = (data: QuotationFormData) => {
    if (!selectedRequestId || !selectedVendorId) {
      toast.error('Please select both a vendor and a quotation request');
      return;
    }

    const validityDate = new Date(data.validityPeriod).getTime() * 1000000;
    submitQuotation.mutate(
      {
        vendorId: selectedVendorId,
        requestId: selectedRequestId,
        unitPrice: parseFloat(data.unitPrice),
        totalPrice,
        deliveryTimeline: data.deliveryTimeline,
        termsAndConditions: data.termsAndConditions,
        validityPeriod: BigInt(validityDate),
      },
      {
        onSuccess: () => {
          toast.success('Quotation submitted successfully');
          setSelectedRequestId('');
          setSelectedVendorId('');
        },
      }
    );
  };

  const activeRequests = requests?.filter((r) => r.status === RequestStatus.pending);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vendor">Select Vendor *</Label>
        {vendorsLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading vendors...
          </div>
        ) : (
          <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a vendor" />
            </SelectTrigger>
            <SelectContent>
              {vendors?.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  {vendor.companyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="request">Select Quotation Request *</Label>
        {requestsLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading requests...
          </div>
        ) : (
          <Select value={selectedRequestId} onValueChange={setSelectedRequestId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a quotation request" />
            </SelectTrigger>
            <SelectContent>
              {activeRequests?.map((request) => (
                <SelectItem key={request.id} value={request.id}>
                  {request.id} - {request.description} ({request.quantity.toString()} {request.unitOfMeasurement})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedRequest && (
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <p className="text-sm font-medium">Request Details:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Quantity:</span>{' '}
              <span className="font-medium">
                {selectedRequest.quantity.toString()} {selectedRequest.unitOfMeasurement}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Required Delivery:</span>{' '}
              <span className="font-medium">
                {new Date(Number(selectedRequest.requiredDeliveryDate) / 1000000).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unitPrice">Unit Price ($) *</Label>
          <Input
            id="unitPrice"
            type="number"
            step="0.01"
            min="0"
            {...register('unitPrice', {
              required: 'Unit price is required',
              min: { value: 0, message: 'Price must be positive' },
            })}
            placeholder="0.00"
          />
          {errors.unitPrice && <p className="text-sm text-destructive">{errors.unitPrice.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalPrice">Total Price ($)</Label>
          <Input
            id="totalPrice"
            type="text"
            value={totalPrice.toFixed(2)}
            disabled
            className="bg-muted"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliveryTimeline">Delivery Timeline *</Label>
        <Input
          id="deliveryTimeline"
          {...register('deliveryTimeline', { required: 'Delivery timeline is required' })}
          placeholder="e.g., 2-3 weeks, 30 days"
        />
        {errors.deliveryTimeline && (
          <p className="text-sm text-destructive">{errors.deliveryTimeline.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="termsAndConditions">Terms and Conditions *</Label>
        <Textarea
          id="termsAndConditions"
          {...register('termsAndConditions', { required: 'Terms and conditions are required' })}
          placeholder="Enter terms and conditions"
          rows={4}
        />
        {errors.termsAndConditions && (
          <p className="text-sm text-destructive">{errors.termsAndConditions.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="validityPeriod">Validity Period *</Label>
        <Input
          id="validityPeriod"
          type="date"
          {...register('validityPeriod', { required: 'Validity period is required' })}
        />
        {errors.validityPeriod && (
          <p className="text-sm text-destructive">{errors.validityPeriod.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={submitQuotation.isPending || !selectedRequestId || !selectedVendorId}>
          {submitQuotation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Quotation
        </Button>
      </div>
    </form>
  );
}
