import { useState } from 'react';
import { useGetQuotationRequestsByStatus } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { RequestStatus } from '../backend';

export default function QuotationRequestTable() {
  const [statusFilter, setStatusFilter] = useState<RequestStatus>(RequestStatus.pending);
  const { data: requests, isLoading } = useGetQuotationRequestsByStatus(statusFilter);

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.pending:
        return <Badge variant="secondary">Pending</Badge>;
      case RequestStatus.received:
        return <Badge variant="default">Received</Badge>;
      case RequestStatus.closed:
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filter by Status</CardTitle>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as RequestStatus)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={RequestStatus.pending}>Pending</SelectItem>
                <SelectItem value={RequestStatus.received}>Received</SelectItem>
                <SelectItem value={RequestStatus.closed}>Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !requests || requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No quotation requests found with status: {statusFilter}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Required Delivery</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-sm">{request.id}</TableCell>
                      <TableCell className="font-medium max-w-xs">{request.description}</TableCell>
                      <TableCell>{request.quantity.toString()}</TableCell>
                      <TableCell>{request.unitOfMeasurement}</TableCell>
                      <TableCell>{formatDate(request.requiredDeliveryDate)}</TableCell>
                      <TableCell>{formatDate(request.requestDate)}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
