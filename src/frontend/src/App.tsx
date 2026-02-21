import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import Layout from './components/Layout';
import VendorManagement from './pages/VendorManagement';
import QuotationRequests from './pages/QuotationRequests';
import QuotationComparison from './pages/QuotationComparison';
import SubmitQuotation from './pages/SubmitQuotation';
import PurchaseRequisitions from './pages/PurchaseRequisitions';
import PurchaseRequisitionDetail from './pages/PurchaseRequisitionDetail';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: VendorManagement,
});

const vendorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendors',
  component: VendorManagement,
});

const purchaseRequisitionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/purchase-requisitions',
  component: PurchaseRequisitions,
});

const purchaseRequisitionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/purchase-requisitions/$id',
  component: PurchaseRequisitionDetail,
});

const quotationRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quotation-requests',
  component: QuotationRequests,
});

const quotationComparisonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quotation-comparison',
  component: QuotationComparison,
});

const submitQuotationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submit-quotation',
  component: SubmitQuotation,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  vendorRoute,
  purchaseRequisitionsRoute,
  purchaseRequisitionDetailRoute,
  quotationRequestsRoute,
  quotationComparisonRoute,
  submitQuotationRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
