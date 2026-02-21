import { useForm } from 'react-hook-form';
import { useCreateQuotationRequest } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface CreateRequestFormProps {
  onSuccess: () => void;
}

interface RequestFormData {
  description: string;
  quantity: string;
  unitOfMeasurement: string;
  requiredDeliveryDate: string;
}

export default function CreateRequestForm({ onSuccess }: CreateRequestFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<RequestFormData>();
  const createRequest = useCreateQuotationRequest();

  const onSubmit = (data: RequestFormData) => {
    const deliveryDate = new Date(data.requiredDeliveryDate).getTime() * 1000000;
    createRequest.mutate(
      {
        description: data.description,
        quantity: BigInt(data.quantity),
        unitOfMeasurement: data.unitOfMeasurement,
        requiredDeliveryDate: BigInt(deliveryDate),
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Product/Material Description *</Label>
        <Textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
          placeholder="Describe the product or material needed"
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            {...register('quantity', {
              required: 'Quantity is required',
              min: { value: 1, message: 'Quantity must be at least 1' },
            })}
            placeholder="Enter quantity"
          />
          {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unitOfMeasurement">Unit of Measurement *</Label>
          <Input
            id="unitOfMeasurement"
            {...register('unitOfMeasurement', { required: 'Unit is required' })}
            placeholder="e.g., kg, pieces, meters"
          />
          {errors.unitOfMeasurement && (
            <p className="text-sm text-destructive">{errors.unitOfMeasurement.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="requiredDeliveryDate">Required Delivery Date *</Label>
        <Input
          id="requiredDeliveryDate"
          type="date"
          {...register('requiredDeliveryDate', { required: 'Delivery date is required' })}
        />
        {errors.requiredDeliveryDate && (
          <p className="text-sm text-destructive">{errors.requiredDeliveryDate.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={createRequest.isPending}>
          {createRequest.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Request
        </Button>
      </div>
    </form>
  );
}
