import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  useGetPurchaseRequisitionById,
  useSubmitForApproval,
  useApprovePurchaseRequisition,
  useRejectPurchaseRequisition,
} from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, CheckCircle2, XCircle, Send, ArrowLeft } from 'lucide-react';
import { PurchaseRequisitionStatus, ApprovalAction } from '../backend';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface PurchaseRequisitionApprovalProps {
  requisitionId: string;
}

export default function PurchaseRequisitionApproval({ requisitionId }: PurchaseRequisitionApprovalProps) {
  const { data: requisition, isLoading } = useGetPurchaseRequisitionById(requisitionId);
  const submitForApproval = useSubmitForApproval();
  const approveRequisition = useApprovePurchaseRequisition();
  const rejectRequisition = useRejectPurchaseRequisition();
  const navigate = useNavigate();

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approverName, setApproverName] = useState('');
  const [comments, setComments] = useState('');

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
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getActionLabel = (action: ApprovalAction) => {
    switch (action) {
      case ApprovalAction.submitted:
        return 'Submitted';
      case ApprovalAction.approved:
        return 'Approved';
      case ApprovalAction.rejected:
        return 'Rejected';
      default:
        return action;
    }
  };

  const handleSubmitForApproval = () => {
    submitForApproval.mutate(requisitionId);
  };

  const handleApprove = () => {
    if (!approverName.trim()) {
      return;
    }
    approveRequisition.mutate(
      {
        requisitionId,
        approverName: approverName.trim(),
        comments: comments.trim(),
      },
      {
        onSuccess: () => {
          setApproveDialogOpen(false);
          setApproverName('');
          setComments('');
        },
      }
    );
  };

  const handleReject = () => {
    if (!approverName.trim() || !comments.trim()) {
      return;
    }
    rejectRequisition.mutate(
      {
        requisitionId,
        approverName: approverName.trim(),
        comments: comments.trim(),
      },
      {
        onSuccess: () => {
          setRejectDialogOpen(false);
          setApproverName('');
          setComments('');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!requisition) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">Purchase requisition not found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/purchase-requisitions' })} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Purchase Requisition Details</CardTitle>
            {getStatusBadge(requisition.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground">Requisition ID</Label>
              <p className="font-mono text-sm">{requisition.id}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Requested By</Label>
              <p className="font-medium">{requisition.requestedBy}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Department</Label>
              <p className="font-medium">{requisition.department}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Created</Label>
              <p className="text-sm">{formatDate(requisition.createdAt)}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Line Items</Label>
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Cost</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requisition.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity.toString()}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.estimatedCost)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(Number(item.quantity) * item.estimatedCost)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">
                      Total Estimated Cost:
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg text-primary">
                      {formatCurrency(requisition.totalEstimatedCost)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Justification</Label>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{requisition.justification}</p>
            </div>
          </div>

          {requisition.status === PurchaseRequisitionStatus.draft && (
            <>
              <Separator />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitForApproval}
                  disabled={submitForApproval.isPending}
                  className="gap-2"
                >
                  {submitForApproval.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Send className="h-4 w-4" />
                  Submit for Approval
                </Button>
              </div>
            </>
          )}

          {requisition.status === PurchaseRequisitionStatus.pendingApproval && (
            <>
              <Separator />
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setRejectDialogOpen(true)}
                  className="gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
                <Button
                  onClick={() => setApproveDialogOpen(true)}
                  className="gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {requisition.approvalHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Approval History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requisition.approvalHistory.map((record, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex-shrink-0 mt-1">
                    {record.action === ApprovalAction.approved ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : record.action === ApprovalAction.rejected ? (
                      <XCircle className="h-5 w-5 text-destructive" />
                    ) : (
                      <Send className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{record.approverName}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(BigInt(record.timestamp))}</p>
                    </div>
                    <p className="text-sm">
                      <span className="font-semibold">{getActionLabel(record.action)}</span>
                      {record.comments && ` - ${record.comments}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Purchase Requisition</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="approverName">Your Name *</Label>
              <Input
                id="approverName"
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comments">Comments (Optional)</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any comments..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={!approverName.trim() || approveRequisition.isPending}
            >
              {approveRequisition.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Purchase Requisition</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectApproverName">Your Name *</Label>
              <Input
                id="rejectApproverName"
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rejectComments">Reason for Rejection *</Label>
              <Textarea
                id="rejectComments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Explain why this requisition is being rejected..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!approverName.trim() || !comments.trim() || rejectRequisition.isPending}
            >
              {rejectRequisition.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
