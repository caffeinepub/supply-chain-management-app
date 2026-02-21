import { useState } from 'react';
import PurchaseRequisitionTable from '../components/PurchaseRequisitionTable';
import CreatePurchaseRequisitionForm from '../components/CreatePurchaseRequisitionForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { PurchaseRequisitionStatus } from '../backend';

export default function PurchaseRequisitions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<PurchaseRequisitionStatus | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Purchase Requisitions</h2>
          <p className="text-muted-foreground mt-1">Create and manage purchase requisitions with approval workflow</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Requisition
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Purchase Requisition</DialogTitle>
            </DialogHeader>
            <CreatePurchaseRequisitionForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={statusFilter ?? 'all'} onValueChange={(value) => setStatusFilter(value === 'all' ? null : value as PurchaseRequisitionStatus)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value={PurchaseRequisitionStatus.draft}>Draft</TabsTrigger>
          <TabsTrigger value={PurchaseRequisitionStatus.pendingApproval}>Pending Approval</TabsTrigger>
          <TabsTrigger value={PurchaseRequisitionStatus.approved}>Approved</TabsTrigger>
          <TabsTrigger value={PurchaseRequisitionStatus.rejected}>Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value={statusFilter ?? 'all'} className="mt-6">
          <PurchaseRequisitionTable statusFilter={statusFilter} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
