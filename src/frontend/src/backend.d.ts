import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export type QuotationRequestId = string;
export interface PurchaseRequisition {
    id: PurchaseRequisitionId;
    totalEstimatedCost: number;
    status: PurchaseRequisitionStatus;
    justification: string;
    approvalHistory: Array<ApprovalRecord>;
    createdAt: bigint;
    updatedAt: bigint;
    items: Array<PurchaseRequisitionItem>;
    department: string;
    requestedBy: string;
}
export interface ApprovalRecord {
    action: ApprovalAction;
    approverName: string;
    timestamp: bigint;
    comments: string;
}
export interface QuotationRequest {
    id: QuotationRequestId;
    status: RequestStatus;
    description: string;
    quantity: bigint;
    unitOfMeasurement: string;
    requiredDeliveryDate: Time;
    requestDate: Time;
}
export interface Quotation {
    id: QuotationId;
    status: QuotationStatus;
    requestId: QuotationRequestId;
    validityPeriod: Time;
    termsAndConditions: string;
    vendorId: VendorId;
    submissionDate: Time;
    deliveryTimeline: string;
    unitPrice: number;
    totalPrice: number;
}
export type QuotationId = string;
export interface PurchaseRequisitionItem {
    description: string;
    quantity: bigint;
    estimatedCost: number;
}
export type PurchaseRequisitionId = string;
export interface Vendor {
    id: VendorId;
    status: VendorStatus;
    contactPerson: string;
    email: string;
    address: string;
    companyName: string;
    category: string;
    phoneNumber: string;
}
export type VendorId = string;
export enum ApprovalAction {
    submitted = "submitted",
    approved = "approved",
    rejected = "rejected"
}
export enum PurchaseRequisitionStatus {
    pendingApproval = "pendingApproval",
    approved = "approved",
    rejected = "rejected",
    draft = "draft"
}
export enum QuotationStatus {
    submitted = "submitted",
    rejected = "rejected",
    shortlisted = "shortlisted",
    accepted = "accepted"
}
export enum RequestStatus {
    closed = "closed",
    pending = "pending",
    received = "received"
}
export enum VendorStatus {
    active = "active",
    inactive = "inactive"
}
export interface backendInterface {
    approvePurchaseRequisition(requisitionId: PurchaseRequisitionId, approverName: string, comments: string): Promise<PurchaseRequisition>;
    createPurchaseRequisition(requestedBy: string, department: string, items: Array<PurchaseRequisitionItem>, totalEstimatedCost: number, justification: string): Promise<PurchaseRequisition>;
    createQuotationRequest(description: string, quantity: bigint, unitOfMeasurement: string, requiredDeliveryDate: Time): Promise<QuotationRequest>;
    createVendor(companyName: string, contactPerson: string, email: string, phoneNumber: string, address: string, category: string): Promise<Vendor>;
    deletePurchaseRequisition(requisitionId: PurchaseRequisitionId): Promise<void>;
    deleteVendor(vendorId: VendorId): Promise<void>;
    getAllQuotationRequests(): Promise<Array<QuotationRequest>>;
    getAllVendors(): Promise<Array<Vendor>>;
    getPendingPurchaseRequisitions(): Promise<Array<PurchaseRequisition>>;
    getPurchaseRequisitionById(requisitionId: PurchaseRequisitionId): Promise<PurchaseRequisition | null>;
    getPurchaseRequisitionsWithFilter(status: PurchaseRequisitionStatus | null): Promise<Array<PurchaseRequisition>>;
    getQuotationRequestsByStatus(status: RequestStatus): Promise<Array<QuotationRequest>>;
    getQuotationsForRequest(requestId: QuotationRequestId): Promise<Array<Quotation>>;
    getVendor(vendorId: VendorId): Promise<Vendor | null>;
    rejectPurchaseRequisition(requisitionId: PurchaseRequisitionId, approverName: string, comments: string): Promise<PurchaseRequisition>;
    submitForApproval(requisitionId: PurchaseRequisitionId): Promise<PurchaseRequisition>;
    submitQuotation(vendorId: VendorId, requestId: QuotationRequestId, unitPrice: number, totalPrice: number, deliveryTimeline: string, termsAndConditions: string, validityPeriod: Time): Promise<Quotation>;
    updatePurchaseRequisition(requisitionId: PurchaseRequisitionId, items: Array<PurchaseRequisitionItem>, totalEstimatedCost: number, justification: string): Promise<PurchaseRequisition>;
    updateQuotationRequestStatus(requestId: QuotationRequestId, status: RequestStatus): Promise<QuotationRequest>;
    updateQuotationStatus(quotationId: QuotationId, status: QuotationStatus): Promise<Quotation>;
    updateVendor(vendorId: VendorId, companyName: string, contactPerson: string, email: string, phoneNumber: string, address: string, category: string, status: VendorStatus): Promise<Vendor>;
}
