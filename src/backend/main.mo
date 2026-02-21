import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Migration "migration";

(with migration = Migration.run)
actor {
  type VendorId = Text;
  type Vendor = {
    id : VendorId;
    companyName : Text;
    contactPerson : Text;
    email : Text;
    phoneNumber : Text;
    address : Text;
    category : Text;
    status : VendorStatus;
  };

  type VendorStatus = {
    #active;
    #inactive;
  };

  type QuotationRequestId = Text;
  type QuotationRequest = {
    id : QuotationRequestId;
    description : Text;
    quantity : Nat;
    unitOfMeasurement : Text;
    requiredDeliveryDate : Time.Time;
    requestDate : Time.Time;
    status : RequestStatus;
  };

  type RequestStatus = {
    #pending;
    #received;
    #closed;
  };

  type QuotationId = Text;
  type Quotation = {
    id : QuotationId;
    vendorId : VendorId;
    requestId : QuotationRequestId;
    unitPrice : Float;
    totalPrice : Float;
    deliveryTimeline : Text;
    termsAndConditions : Text;
    validityPeriod : Time.Time;
    submissionDate : Time.Time;
    status : QuotationStatus;
  };

  type QuotationStatus = {
    #submitted;
    #shortlisted;
    #rejected;
    #accepted;
  };

  type PurchaseRequisitionId = Text;
  type PurchaseRequisitionStatus = {
    #draft;
    #pendingApproval;
    #approved;
    #rejected;
  };

  type PurchaseRequisitionItem = {
    description : Text;
    quantity : Nat;
    estimatedCost : Float;
  };

  type ApprovalRecord = {
    approverName : Text;
    action : ApprovalAction;
    timestamp : Int;
    comments : Text;
  };

  public type ApprovalAction = {
    #submitted;
    #approved;
    #rejected;
  };

  public type PurchaseRequisition = {
    id : PurchaseRequisitionId;
    requestedBy : Text;
    department : Text;
    items : [PurchaseRequisitionItem];
    totalEstimatedCost : Float;
    justification : Text;
    status : PurchaseRequisitionStatus;
    createdAt : Int;
    updatedAt : Int;
    approvalHistory : [ApprovalRecord];
  };

  let vendors = Map.empty<VendorId, Vendor>();
  let quotationRequests = Map.empty<QuotationRequestId, QuotationRequest>();
  let quotations = Map.empty<QuotationId, Quotation>();
  let purchaseRequisitions = Map.empty<PurchaseRequisitionId, PurchaseRequisition>();

  func generateId(prefix : Text) : Text {
    prefix # Time.now().toText();
  };

  public shared ({ caller }) func createVendor(
    companyName : Text,
    contactPerson : Text,
    email : Text,
    phoneNumber : Text,
    address : Text,
    category : Text
  ) : async Vendor {
    let vendorId = generateId("VEN-");
    let vendor : Vendor = {
      id = vendorId;
      companyName;
      contactPerson;
      email;
      phoneNumber;
      address;
      category;
      status = #active;
    };
    vendors.add(vendorId, vendor);
    vendor;
  };

  public query ({ caller }) func getVendor(vendorId : VendorId) : async ?Vendor {
    vendors.get(vendorId);
  };

  public query ({ caller }) func getAllVendors() : async [Vendor] {
    vendors.values().toArray();
  };

  public shared ({ caller }) func updateVendor(
    vendorId : VendorId,
    companyName : Text,
    contactPerson : Text,
    email : Text,
    phoneNumber : Text,
    address : Text,
    category : Text,
    status : VendorStatus
  ) : async Vendor {
    switch (vendors.get(vendorId)) {
      case (null) { Runtime.trap("Vendor does not exist") };
      case (?_vendor) {
        let updatedVendor : Vendor = {
          id = vendorId;
          companyName;
          contactPerson;
          email;
          phoneNumber;
          address;
          category;
          status;
        };
        vendors.add(vendorId, updatedVendor);
        updatedVendor;
      };
    };
  };

  public shared ({ caller }) func deleteVendor(vendorId : VendorId) : async () {
    if (not vendors.containsKey(vendorId)) {
      Runtime.trap("Vendor does not exist");
    };
    vendors.remove(vendorId);
  };

  public shared ({ caller }) func createQuotationRequest(description : Text, quantity : Nat, unitOfMeasurement : Text, requiredDeliveryDate : Time.Time) : async QuotationRequest {
    let requestId = generateId("REQ-");
    let request : QuotationRequest = {
      id = requestId;
      description;
      quantity;
      unitOfMeasurement;
      requiredDeliveryDate;
      requestDate = Time.now();
      status = #pending;
    };
    quotationRequests.add(requestId, request);
    request;
  };

  public query ({ caller }) func getAllQuotationRequests() : async [QuotationRequest] {
    quotationRequests.values().toArray();
  };

  public query ({ caller }) func getQuotationRequestsByStatus(status : RequestStatus) : async [QuotationRequest] {
    quotationRequests.values().toArray().filter(
      func(request) {
        request.status == status;
      }
    );
  };

  public shared ({ caller }) func submitQuotation(
    vendorId : VendorId,
    requestId : QuotationRequestId,
    unitPrice : Float,
    totalPrice : Float,
    deliveryTimeline : Text,
    termsAndConditions : Text,
    validityPeriod : Time.Time
  ) : async Quotation {
    let quotationId = generateId("QUOTE-");
    let quotation : Quotation = {
      id = quotationId;
      vendorId;
      requestId;
      unitPrice;
      totalPrice;
      deliveryTimeline;
      termsAndConditions;
      validityPeriod;
      submissionDate = Time.now();
      status = #submitted;
    };
    quotations.add(quotationId, quotation);
    quotation;
  };

  public query ({ caller }) func getQuotationsForRequest(requestId : QuotationRequestId) : async [Quotation] {
    quotations.values().toArray().filter(
      func(quotation) {
        quotation.requestId == requestId;
      }
    );
  };

  public shared ({ caller }) func updateQuotationStatus(quotationId : QuotationId, status : QuotationStatus) : async Quotation {
    switch (quotations.get(quotationId)) {
      case (null) { Runtime.trap("Quotation does not exist") };
      case (?quotation) {
        let updatedQuotation : Quotation = {
          id = quotationId;
          vendorId = quotation.vendorId;
          requestId = quotation.requestId;
          unitPrice = quotation.unitPrice;
          totalPrice = quotation.totalPrice;
          deliveryTimeline = quotation.deliveryTimeline;
          termsAndConditions = quotation.termsAndConditions;
          validityPeriod = quotation.validityPeriod;
          submissionDate = quotation.submissionDate;
          status;
        };
        quotations.add(quotationId, updatedQuotation);
        updatedQuotation;
      };
    };
  };

  public shared ({ caller }) func updateQuotationRequestStatus(requestId : QuotationRequestId, status : RequestStatus) : async QuotationRequest {
    switch (quotationRequests.get(requestId)) {
      case (null) { Runtime.trap("Quotation request does not exist") };
      case (?request) {
        let updatedRequest : QuotationRequest = {
          id = requestId;
          description = request.description;
          quantity = request.quantity;
          unitOfMeasurement = request.unitOfMeasurement;
          requiredDeliveryDate = request.requiredDeliveryDate;
          requestDate = request.requestDate;
          status;
        };
        quotationRequests.add(requestId, updatedRequest);
        updatedRequest;
      };
    };
  };

  public shared ({ caller }) func createPurchaseRequisition(
    requestedBy : Text,
    department : Text,
    items : [PurchaseRequisitionItem],
    totalEstimatedCost : Float,
    justification : Text
  ) : async PurchaseRequisition {
    let requisitionId = generateId("PR-");
    let timestamp = Time.now();
    let requisition : PurchaseRequisition = {
      id = requisitionId;
      requestedBy;
      department;
      items;
      totalEstimatedCost;
      justification;
      status = #draft;
      createdAt = timestamp;
      updatedAt = timestamp;
      approvalHistory = [];
    };
    purchaseRequisitions.add(requisitionId, requisition);
    requisition;
  };

  public query ({ caller }) func getPurchaseRequisitionById(requisitionId : PurchaseRequisitionId) : async ?PurchaseRequisition {
    purchaseRequisitions.get(requisitionId);
  };

  public query ({ caller }) func getPurchaseRequisitionsWithFilter(status : ?PurchaseRequisitionStatus) : async [PurchaseRequisition] {
    purchaseRequisitions.values().toArray().filter(
      func(requisition) {
        switch (status) {
          case (null) { true };
          case (?s) { requisition.status == s };
        };
      }
    );
  };

  public shared ({ caller }) func updatePurchaseRequisition(
    requisitionId : PurchaseRequisitionId,
    items : [PurchaseRequisitionItem],
    totalEstimatedCost : Float,
    justification : Text
  ) : async PurchaseRequisition {
    switch (purchaseRequisitions.get(requisitionId)) {
      case (null) { Runtime.trap("Purchase requisition does not exist") };
      case (?requisition) {
        if (requisition.status != #draft) {
          Runtime.trap("Only draft requisitions can be updated");
        };

        let updatedRequisition : PurchaseRequisition = {
          id = requisition.id;
          requestedBy = requisition.requestedBy;
          department = requisition.department;
          items;
          totalEstimatedCost;
          justification;
          status = requisition.status;
          createdAt = requisition.createdAt;
          updatedAt = Time.now();
          approvalHistory = requisition.approvalHistory;
        };
        purchaseRequisitions.add(requisitionId, updatedRequisition);
        updatedRequisition;
      };
    };
  };

  public shared ({ caller }) func deletePurchaseRequisition(requisitionId : PurchaseRequisitionId) : async () {
    switch (purchaseRequisitions.get(requisitionId)) {
      case (null) { Runtime.trap("Purchase requisition does not exist") };
      case (?requisition) {
        if (requisition.status != #draft) {
          Runtime.trap("Only draft requisitions can be deleted");
        };
      };
    };
    purchaseRequisitions.remove(requisitionId);
  };

  public shared ({ caller }) func submitForApproval(requisitionId : PurchaseRequisitionId) : async PurchaseRequisition {
    switch (purchaseRequisitions.get(requisitionId)) {
      case (null) { Runtime.trap("Purchase requisition does not exist") };
      case (?requisition) {
        if (requisition.status != #draft) {
          Runtime.trap("Only draft requisitions can be submitted for approval");
        };

        let approvalRecord : ApprovalRecord = {
          approverName = requisition.requestedBy;
          action = #submitted;
          timestamp = Time.now();
          comments = "Submitted for approval";
        };

        let updatedRequisition : PurchaseRequisition = {
          id = requisition.id;
          requestedBy = requisition.requestedBy;
          department = requisition.department;
          items = requisition.items;
          totalEstimatedCost = requisition.totalEstimatedCost;
          justification = requisition.justification;
          status = #pendingApproval;
          createdAt = requisition.createdAt;
          updatedAt = Time.now();
          approvalHistory = requisition.approvalHistory.concat([approvalRecord]);
        };
        purchaseRequisitions.add(requisitionId, updatedRequisition);
        updatedRequisition;
      };
    };
  };

  public query ({ caller }) func getPendingPurchaseRequisitions() : async [PurchaseRequisition] {
    purchaseRequisitions.values().toArray().filter(
      func(requisition) {
        requisition.status == #pendingApproval;
      }
    );
  };

  public shared ({ caller }) func approvePurchaseRequisition(
    requisitionId : PurchaseRequisitionId,
    approverName : Text,
    comments : Text,
  ) : async PurchaseRequisition {
    switch (purchaseRequisitions.get(requisitionId)) {
      case (null) { Runtime.trap("Purchase requisition does not exist") };
      case (?requisition) {
        if (requisition.status != #pendingApproval) {
          Runtime.trap("Only pending requisitions can be approved");
        };

        let approvalRecord : ApprovalRecord = {
          approverName;
          action = #approved;
          timestamp = Time.now();
          comments;
        };

        let updatedRequisition : PurchaseRequisition = {
          id = requisition.id;
          requestedBy = requisition.requestedBy;
          department = requisition.department;
          items = requisition.items;
          totalEstimatedCost = requisition.totalEstimatedCost;
          justification = requisition.justification;
          status = #approved;
          createdAt = requisition.createdAt;
          updatedAt = Time.now();
          approvalHistory = requisition.approvalHistory.concat([approvalRecord]);
        };
        purchaseRequisitions.add(requisitionId, updatedRequisition);
        updatedRequisition;
      };
    };
  };

  public shared ({ caller }) func rejectPurchaseRequisition(
    requisitionId : PurchaseRequisitionId,
    approverName : Text,
    comments : Text,
  ) : async PurchaseRequisition {
    switch (purchaseRequisitions.get(requisitionId)) {
      case (null) { Runtime.trap("Purchase requisition does not exist") };
      case (?requisition) {
        if (requisition.status != #pendingApproval) {
          Runtime.trap("Only pending requisitions can be rejected");
        };

        let approvalRecord : ApprovalRecord = {
          approverName;
          action = #rejected;
          timestamp = Time.now();
          comments;
        };

        let updatedRequisition : PurchaseRequisition = {
          id = requisition.id;
          requestedBy = requisition.requestedBy;
          department = requisition.department;
          items = requisition.items;
          totalEstimatedCost = requisition.totalEstimatedCost;
          justification = requisition.justification;
          status = #rejected;
          createdAt = requisition.createdAt;
          updatedAt = Time.now();
          approvalHistory = requisition.approvalHistory.concat([approvalRecord]);
        };
        purchaseRequisitions.add(requisitionId, updatedRequisition);
        updatedRequisition;
      };
    };
  };
};

