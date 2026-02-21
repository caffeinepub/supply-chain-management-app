import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  // Old types (before purchase requisitions)
  type OldVendor = {
    id : Text;
    companyName : Text;
    contactPerson : Text;
    email : Text;
    phoneNumber : Text;
    address : Text;
    category : Text;
    status : {
      #active;
      #inactive;
    };
  };

  type OldQuotationRequest = {
    id : Text;
    description : Text;
    quantity : Nat;
    unitOfMeasurement : Text;
    requiredDeliveryDate : Int;
    requestDate : Int;
    status : {
      #pending;
      #received;
      #closed;
    };
  };

  type OldQuotation = {
    id : Text;
    vendorId : Text;
    requestId : Text;
    unitPrice : Float;
    totalPrice : Float;
    deliveryTimeline : Text;
    termsAndConditions : Text;
    validityPeriod : Int;
    submissionDate : Int;
    status : {
      #submitted;
      #shortlisted;
      #rejected;
      #accepted;
    };
  };

  type OldActor = {
    vendors : Map.Map<Text, OldVendor>;
    quotationRequests : Map.Map<Text, OldQuotationRequest>;
    quotations : Map.Map<Text, OldQuotation>;
  };

  // New type (after adding purchase requisitions)
  type ApprovalRecord = {
    approverName : Text;
    action : {
      #submitted;
      #approved;
      #rejected;
    };
    timestamp : Int;
    comments : Text;
  };

  type PurchaseRequisition = {
    id : Text;
    requestedBy : Text;
    department : Text;
    items : [PurchaseRequisitionItem];
    totalEstimatedCost : Float;
    justification : Text;
    status : {
      #draft;
      #pendingApproval;
      #approved;
      #rejected;
    };
    createdAt : Int;
    updatedAt : Int;
    approvalHistory : [ApprovalRecord];
  };

  type PurchaseRequisitionItem = {
    description : Text;
    quantity : Nat;
    estimatedCost : Float;
  };

  type NewActor = {
    vendors : Map.Map<Text, OldVendor>;
    quotationRequests : Map.Map<Text, OldQuotationRequest>;
    quotations : Map.Map<Text, OldQuotation>;
    purchaseRequisitions : Map.Map<Text, PurchaseRequisition>;
  };

  public func run(old : OldActor) : NewActor {
    {
      vendors = old.vendors;
      quotationRequests = old.quotationRequests;
      quotations = old.quotations;
      // Initialize empty purchase requisitions for existing deployments
      purchaseRequisitions = Map.empty<Text, PurchaseRequisition>();
    };
  };
};
