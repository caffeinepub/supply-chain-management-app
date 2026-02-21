import { useState } from 'react';
import QuotationComparisonTable from '../components/QuotationComparisonTable';
import { useGetAllQuotationRequests } from '../hooks/useQueries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function QuotationComparison() {
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const { data: requests, isLoading } = useGetAllQuotationRequests();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Compare Quotations</h2>
        <p className="text-muted-foreground mt-1">Review and evaluate vendor quotations side-by-side</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Quotation Request</CardTitle>
          <CardDescription>Choose a request to view and compare all submitted quotations</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading requests...
            </div>
          ) : (
            <Select value={selectedRequestId} onValueChange={setSelectedRequestId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a quotation request" />
              </SelectTrigger>
              <SelectContent>
                {requests?.map((request) => (
                  <SelectItem key={request.id} value={request.id}>
                    {request.id} - {request.description} ({request.quantity.toString()} {request.unitOfMeasurement})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {selectedRequestId && <QuotationComparisonTable requestId={selectedRequestId} />}
    </div>
  );
}
