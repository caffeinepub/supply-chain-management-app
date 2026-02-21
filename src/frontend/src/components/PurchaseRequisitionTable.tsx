import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetPurchaseRequisitions, useDeletePurchaseRequisition } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Trash2, Edit, Eye } from 'lucide-react';
import { PurchaseRequisitionStatus, type PurchaseRequisition } from '../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditPurchaseRequisitionForm from './EditPurchaseRequisitionForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PurchaseRequisitionTableProps {
  statusFilter?: PurchaseRequisitionStatus | null;
}

export default function PurchaseRequisitionTable({ statusFilter }: PurchaseRequisitionTableProps) {
  const { data: requisitions, isLoading } = useGetPurchaseRequisitions(statusFilter);
  const deleteRequisition = useDeletePurchaseRequisition();
  const navigate = useNavigate();
  const [editingRequisition, setEditingRequisition] = useState<PurchaseRequisition | null>(null);
  const [deletingRequisitionId, setDeletingRequisitionId] = useState<string | null>(null);

  const getStatusBadge = (status: PurchaseRequisitionStatus) => {
    switch (status) {
      case PurchaseRequisitionStatus.draft:
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Draft</Badge>;
      case PurchaseRequisitionStatus.pendingApproval:
        return <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Pending Approval</Badge>;
      case PurchaseRequisitionStatus.approved:
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Approved</Badge>;
      case PurchaseRequisitionStatus.rejected:
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!requisitions || requisitions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No purchase requisitions found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requisitions.map((requisition) => (
                  <TableRow key={requisition.id}>
                    <TableCell className="font-mono text-sm">{requisition.id}</TableCell>
                    <TableCell className="font-medium">{requisition.requestedBy}</TableCell>
                    <TableCell>{requisition.department}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(requisition.totalEstimatedCost)}</TableCell>
                    <TableCell>{getStatusBadge(requisition.status)}</TableCell>
                    <TableCell>{formatDate(requisition.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate({ to: '/purchase-requisitions/$id', params: { id: requisition.id } })}
                          className="gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        {requisition.status === PurchaseRequisitionStatus.draft && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingRequisition(requisition)}
                              className="gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeletingRequisitionId(requisition.id)}
                              className="gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingRequisition} onOpenChange={(open) => !open && setEditingRequisition(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Purchase Requisition</DialogTitle>
          </DialogHeader>
          {editingRequisition && (
            <EditPurchaseRequisitionForm
              requisition={editingRequisition}
              onSuccess={() => setEditingRequisition(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingRequisitionId} onOpenChange={(open) => !open && setDeletingRequisitionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the purchase requisition from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingRequisitionId) {
                  deleteRequisition.mutate(deletingRequisitionId);
                  setDeletingRequisitionId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
