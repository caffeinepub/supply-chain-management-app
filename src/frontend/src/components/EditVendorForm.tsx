import { useForm } from 'react-hook-form';
import { useUpdateVendor } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { VendorStatus, type Vendor } from '../backend';
import { useState } from 'react';

interface EditVendorFormProps {
  vendor: Vendor;
  onSuccess: () => void;
}

interface VendorFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address: string;
  category: string;
}

export default function EditVendorForm({ vendor, onSuccess }: EditVendorFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<VendorFormData>({
    defaultValues: {
      companyName: vendor.companyName,
      contactPerson: vendor.contactPerson,
      email: vendor.email,
      phoneNumber: vendor.phoneNumber,
      address: vendor.address,
      category: vendor.category,
    },
  });
  const [status, setStatus] = useState<VendorStatus>(vendor.status);
  const updateVendor = useUpdateVendor();

  const onSubmit = (data: VendorFormData) => {
    updateVendor.mutate(
      {
        vendorId: vendor.id,
        ...data,
        status,
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            {...register('companyName', { required: 'Company name is required' })}
            placeholder="Enter company name"
          />
          {errors.companyName && (
            <p className="text-sm text-destructive">{errors.companyName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact Person *</Label>
          <Input
            id="contactPerson"
            {...register('contactPerson', { required: 'Contact person is required' })}
            placeholder="Enter contact person"
          />
          {errors.contactPerson && (
            <p className="text-sm text-destructive">{errors.contactPerson.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
            })}
            placeholder="email@example.com"
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            {...register('phoneNumber', { required: 'Phone number is required' })}
            placeholder="+1 (555) 000-0000"
          />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            {...register('address', { required: 'Address is required' })}
            placeholder="Enter full address"
          />
          {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            {...register('category', { required: 'Category is required' })}
            placeholder="Enter vendor category"
          />
          {errors.category && (
            <p className="text-sm text-destructive">{errors.category.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as VendorStatus)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={VendorStatus.active}>Active</SelectItem>
            <SelectItem value={VendorStatus.inactive}>Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={updateVendor.isPending}>
          {updateVendor.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Vendor
        </Button>
      </div>
    </form>
  );
}
