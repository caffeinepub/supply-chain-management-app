import QuotationSubmissionForm from '../components/QuotationSubmissionForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubmitQuotation() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Submit Quotation</h2>
        <p className="text-muted-foreground mt-1">Respond to quotation requests with your pricing and terms</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quotation Details</CardTitle>
          <CardDescription>Fill in all required information to submit your quotation</CardDescription>
        </CardHeader>
        <CardContent>
          <QuotationSubmissionForm />
        </CardContent>
      </Card>
    </div>
  );
}
