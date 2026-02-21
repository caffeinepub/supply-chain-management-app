import { useGetQuotationsForRequest, useUpdateQuotationStatus, useGetAllVendors } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Star } from 'lucide-react';
import { QuotationStatus } from '../backend';

interface QuotationComparisonTableProps {
  requestId: string;
}

export default function QuotationComparisonTable({ requestId }: QuotationComparisonTableProps) {
  const { data: quotations, isLoading } = useGetQuotationsForRequest(requestId);
  const { data: vendors } = useGetAllVendors();
  const updateStatus = useUpdateQuotationStatus();

  const getVendorName = (vendorId: string) => {
    const vendor = vendors?.find((v) => v.id === vendorId);
    return vendor?.companyName || vendorId;
  };

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case QuotationStatus.submitted:
        return <Badge variant="secondary">Submitted</Badge>;
      case QuotationStatus.shortlisted:
        return <Badge variant="default">Shortlisted</Badge>;
      case QuotationStatus.rejected:
        return <Badge variant="destructive">Rejected</Badge>;
      case QuotationStatus.accepted:
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            Accepted
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleStatusUpdate = (quotationId: string, status: QuotationStatus) => {
    updateStatus.mutate({ quotationId, status });
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

  if (!quotations || quotations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No quotations submitted for this request yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quotation Comparison ({quotations.length} quotations)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Delivery Timeline</TableHead>
                <TableHead>Validity Period</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell className="font-medium">{getVendorName(quotation.vendorId)}</TableCell>
                  <TableCell>${quotation.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">${quotation.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>{quotation.deliveryTimeline}</TableCell>
                  <TableCell>{formatDate(quotation.validityPeriod)}</TableCell>
                  <TableCell>{formatDate(quotation.submissionDate)}</TableCell>
                  <TableCell>{getStatusBadge(quotation.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {quotation.status !== QuotationStatus.shortlisted && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(quotation.id, QuotationStatus.shortlisted)}
                          disabled={updateStatus.isPending}
                          className="gap-1"
                        >
                          <Star className="h-3 w-3" />
                          Shortlist
                        </Button>
                      )}
                      {quotation.status !== QuotationStatus.accepted && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleStatusUpdate(quotation.id, QuotationStatus.accepted)}
                          disabled={updateStatus.isPending}
                          className="gap-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Accept
                        </Button>
                      )}
                      {quotation.status !== QuotationStatus.rejected && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleStatusUpdate(quotation.id, QuotationStatus.rejected)}
                          disabled={updateStatus.isPending}
                          className="gap-1"
                        >
                          <XCircle className="h-3 w-3" />
                          Reject
                        </Button>
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
  );
}
