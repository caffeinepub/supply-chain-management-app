import { useState } from 'react';
import QuotationRequestTable from '../components/QuotationRequestTable';
import CreateRequestForm from '../components/CreateRequestForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export default function QuotationRequests() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Quotation Requests</h2>
          <p className="text-muted-foreground mt-1">Create and track quotation requests from vendors</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Quotation Request</DialogTitle>
            </DialogHeader>
            <CreateRequestForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <QuotationRequestTable />
    </div>
  );
}
