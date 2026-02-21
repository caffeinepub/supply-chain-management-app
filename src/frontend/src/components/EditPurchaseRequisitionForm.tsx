import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useUpdatePurchaseRequisition } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import type { PurchaseRequisition, PurchaseRequisitionItem } from '../backend';

interface EditPurchaseRequisitionFormProps {
  requisition: PurchaseRequisition;
  onSuccess: () => void;
}

interface FormItem {
  description: string;
  quantity: string;
  estimatedCost: string;
}

interface PurchaseRequisitionFormData {
  items: FormItem[];
  justification: string;
}

export default function EditPurchaseRequisitionForm({ requisition, onSuccess }: EditPurchaseRequisitionFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<PurchaseRequisitionFormData>({
    defaultValues: {
      items: requisition.items.map(item => ({
        description: item.description,
        quantity: item.quantity.toString(),
        estimatedCost: item.estimatedCost.toString(),
      })),
      justification: requisition.justification,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = useWatch({ control, name: 'items' });
  const updateRequisition = useUpdatePurchaseRequisition();

  const totalEstimatedCost = watchedItems.reduce((sum, item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const cost = parseFloat(item.estimatedCost) || 0;
    return sum + (quantity * cost);
  }, 0);

  const onSubmit = (data: PurchaseRequisitionFormData) => {
    const items: PurchaseRequisitionItem[] = data.items.map(item => ({
      description: item.description,
      quantity: BigInt(parseInt(item.quantity)),
      estimatedCost: parseFloat(item.estimatedCost),
    }));

    updateRequisition.mutate(
      {
        requisitionId: requisition.id,
        items,
        totalEstimatedCost,
        justification: data.justification,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
        <div className="space-y-1">
          <Label className="text-muted-foreground">Requested By</Label>
          <p className="font-medium">{requisition.requestedBy}</p>
        </div>

        <div className="space-y-1">
          <Label className="text-muted-foreground">Department</Label>
          <p className="font-medium">{requisition.department}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Line Items *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ description: '', quantity: '', estimatedCost: '' })}
            className="gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Item {index + 1}</span>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`items.${index}.description`}>Description *</Label>
                <Input
                  id={`items.${index}.description`}
                  {...register(`items.${index}.description`, { required: 'Description is required' })}
                  placeholder="Enter item description"
                />
                {errors.items?.[index]?.description && (
                  <p className="text-sm text-destructive">{errors.items[index]?.description?.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.quantity`}>Quantity *</Label>
                  <Input
                    id={`items.${index}.quantity`}
                    type="number"
                    min="1"
                    step="1"
                    {...register(`items.${index}.quantity`, {
                      required: 'Quantity is required',
                      min: { value: 1, message: 'Quantity must be at least 1' },
                      pattern: { value: /^\d+$/, message: 'Quantity must be a whole number' },
                    })}
                    placeholder="0"
                  />
                  {errors.items?.[index]?.quantity && (
                    <p className="text-sm text-destructive">{errors.items[index]?.quantity?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.estimatedCost`}>Unit Cost ($) *</Label>
                  <Input
                    id={`items.${index}.estimatedCost`}
                    type="number"
                    min="0"
                    step="0.01"
                    {...register(`items.${index}.estimatedCost`, {
                      required: 'Estimated cost is required',
                      min: { value: 0.01, message: 'Cost must be greater than 0' },
                    })}
                    placeholder="0.00"
                  />
                  {errors.items?.[index]?.estimatedCost && (
                    <p className="text-sm text-destructive">{errors.items[index]?.estimatedCost?.message}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="justification">Justification *</Label>
        <Textarea
          id="justification"
          {...register('justification', { required: 'Justification is required' })}
          placeholder="Explain why this purchase is necessary"
          rows={4}
        />
        {errors.justification && (
          <p className="text-sm text-destructive">{errors.justification.message}</p>
        )}
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total Estimated Cost:</span>
          <span className="text-primary">${totalEstimatedCost.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={updateRequisition.isPending}>
          {updateRequisition.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Requisition
        </Button>
      </div>
    </form>
  );
}
