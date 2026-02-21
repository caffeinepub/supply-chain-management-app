# Specification

## Summary
**Goal:** Add a purchase requisition management system with creation, viewing, and approval workflow capabilities.

**Planned changes:**
- Add PurchaseRequisition type and CRUD operations in the backend with status management (Draft, PendingApproval, Approved, Rejected)
- Implement approval workflow methods (submit, approve, reject) with approval history tracking
- Create React Query hooks for all purchase requisition operations
- Build CreatePurchaseRequisitionForm with dynamic line items and auto-calculated totals
- Create PurchaseRequisitionTable with status filtering and conditional actions
- Build PurchaseRequisitionApproval component with approval history timeline and action buttons
- Add PurchaseRequisitions page at /purchase-requisitions route
- Add Purchase Requisitions navigation link between Vendors and Quotation Requests

**User-visible outcome:** Users can create purchase requisitions with multiple line items, view them filtered by status, submit drafts for approval, and approve or reject pending requisitions with comments and history tracking.
