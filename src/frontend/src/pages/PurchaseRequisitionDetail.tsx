import { useParams } from '@tanstack/react-router';
import PurchaseRequisitionApproval from '../components/PurchaseRequisitionApproval';

export default function PurchaseRequisitionDetail() {
  const { id } = useParams({ from: '/purchase-requisitions/$id' });

  return <PurchaseRequisitionApproval requisitionId={id} />;
}
