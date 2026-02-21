import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { VendorStatus, RequestStatus, QuotationStatus, PurchaseRequisitionStatus, type Time, type Vendor, type QuotationRequest, type Quotation, type PurchaseRequisition, type PurchaseRequisitionItem } from '../backend';
import { toast } from 'sonner';

// Vendor Queries
export function useGetAllVendors() {
  const { actor, isFetching } = useActor();

  return useQuery<Vendor[]>({
    queryKey: ['vendors'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getAllVendors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      companyName: string;
      contactPerson: string;
      email: string;
      phoneNumber: string;
      address: string;
      category: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.createVendor(
        data.companyName,
        data.contactPerson,
        data.email,
        data.phoneNumber,
        data.address,
        data.category
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create vendor: ' + error.message);
    },
  });
}

export function useUpdateVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      vendorId: string;
      companyName: string;
      contactPerson: string;
      email: string;
      phoneNumber: string;
      address: string;
      category: string;
      status: VendorStatus;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.updateVendor(
        data.vendorId,
        data.companyName,
        data.contactPerson,
        data.email,
        data.phoneNumber,
        data.address,
        data.category,
        data.status
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update vendor: ' + error.message);
    },
  });
}

export function useDeleteVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendorId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.deleteVendor(vendorId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete vendor: ' + error.message);
    },
  });
}

// Quotation Request Queries
export function useGetQuotationRequestsByStatus(status: RequestStatus) {
  const { actor, isFetching } = useActor();

  return useQuery<QuotationRequest[]>({
    queryKey: ['quotationRequests', status],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getQuotationRequestsByStatus(status);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllQuotationRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<QuotationRequest[]>({
    queryKey: ['quotationRequests', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getAllQuotationRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateQuotationRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      description: string;
      quantity: bigint;
      unitOfMeasurement: string;
      requiredDeliveryDate: Time;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.createQuotationRequest(
        data.description,
        data.quantity,
        data.unitOfMeasurement,
        data.requiredDeliveryDate
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['quotationRequests'], exact: false });
      toast.success('Quotation request created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create quotation request: ' + error.message);
    },
  });
}

// Quotation Queries
export function useGetQuotationsForRequest(requestId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Quotation[]>({
    queryKey: ['quotations', requestId],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getQuotationsForRequest(requestId);
    },
    enabled: !!actor && !isFetching && !!requestId,
  });
}

export function useSubmitQuotation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      vendorId: string;
      requestId: string;
      unitPrice: number;
      totalPrice: number;
      deliveryTimeline: string;
      termsAndConditions: string;
      validityPeriod: Time;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.submitQuotation(
        data.vendorId,
        data.requestId,
        data.unitPrice,
        data.totalPrice,
        data.deliveryTimeline,
        data.termsAndConditions,
        data.validityPeriod
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['quotations'] });
      await queryClient.invalidateQueries({ queryKey: ['quotationRequests'], exact: false });
      toast.success('Quotation submitted successfully');
    },
    onError: (error) => {
      toast.error('Failed to submit quotation: ' + error.message);
    },
  });
}

export function useUpdateQuotationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { quotationId: string; status: QuotationStatus }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.updateQuotationStatus(data.quotationId, data.status);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast.success('Quotation status updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update quotation status: ' + error.message);
    },
  });
}

export function useUpdateQuotationRequestStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { requestId: string; status: RequestStatus }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.updateQuotationRequestStatus(data.requestId, data.status);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['quotationRequests'], exact: false });
      toast.success('Request status updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update request status: ' + error.message);
    },
  });
}

// Purchase Requisition Queries
export function useGetPurchaseRequisitions(status?: PurchaseRequisitionStatus | null) {
  const { actor, isFetching } = useActor();

  return useQuery<PurchaseRequisition[]>({
    queryKey: ['purchaseRequisitions', status ?? 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getPurchaseRequisitionsWithFilter(status ?? null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPurchaseRequisitionById(requisitionId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<PurchaseRequisition | null>({
    queryKey: ['purchaseRequisition', requisitionId],
    queryFn: async () => {
      if (!actor) return null;
      return await actor.getPurchaseRequisitionById(requisitionId);
    },
    enabled: !!actor && !isFetching && !!requisitionId,
  });
}

export function useCreatePurchaseRequisition() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      requestedBy: string;
      department: string;
      items: PurchaseRequisitionItem[];
      totalEstimatedCost: number;
      justification: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.createPurchaseRequisition(
        data.requestedBy,
        data.department,
        data.items,
        data.totalEstimatedCost,
        data.justification
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['purchaseRequisitions'] });
      toast.success('Purchase requisition created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create purchase requisition: ' + error.message);
    },
  });
}

export function useUpdatePurchaseRequisition() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      requisitionId: string;
      items: PurchaseRequisitionItem[];
      totalEstimatedCost: number;
      justification: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.updatePurchaseRequisition(
        data.requisitionId,
        data.items,
        data.totalEstimatedCost,
        data.justification
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['purchaseRequisitions'] });
      toast.success('Purchase requisition updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update purchase requisition: ' + error.message);
    },
  });
}

export function useDeletePurchaseRequisition() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requisitionId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.deletePurchaseRequisition(requisitionId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['purchaseRequisitions'] });
      toast.success('Purchase requisition deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete purchase requisition: ' + error.message);
    },
  });
}

export function useSubmitForApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requisitionId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.submitForApproval(requisitionId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['purchaseRequisitions'] });
      toast.success('Purchase requisition submitted for approval');
    },
    onError: (error) => {
      toast.error('Failed to submit for approval: ' + error.message);
    },
  });
}

export function useApprovePurchaseRequisition() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      requisitionId: string;
      approverName: string;
      comments: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.approvePurchaseRequisition(
        data.requisitionId,
        data.approverName,
        data.comments
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['purchaseRequisitions'] });
      toast.success('Purchase requisition approved successfully');
    },
    onError: (error) => {
      toast.error('Failed to approve purchase requisition: ' + error.message);
    },
  });
}

export function useRejectPurchaseRequisition() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      requisitionId: string;
      approverName: string;
      comments: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.rejectPurchaseRequisition(
        data.requisitionId,
        data.approverName,
        data.comments
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['purchaseRequisitions'] });
      toast.success('Purchase requisition rejected');
    },
    onError: (error) => {
      toast.error('Failed to reject purchase requisition: ' + error.message);
    },
  });
}
