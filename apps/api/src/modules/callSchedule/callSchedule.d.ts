export interface CallScheduleFilter {
    id: string;
    type: CallScheduleType;
    datetime: Date;
    status: CallScheduleStatus;
    intent: CallIntent;
    notes: string;
    otherIntent: string;
    leadId: string;
    contactId: string;
}

enum CallScheduleType {
    FIXED = 'fixed',
    CUSTOM = 'custom',
}
  
enum CallScheduleStatus {
SCHEDULED = 'scheduled',
COMPLETED = 'completed',
MISSED = 'missed',
}

enum CallIntent {
    FOLLOW_UP = 'follow_up', // Follow up on previous interaction
    DEMO = 'follow_up', // Demonstrate a product or service
    INITIAL_CONTACT = 'initial_contact', // First point of contact with the lead
    CLOSE_DEAL = 'close_deal', // Finalize and close a deal
    CUSTOMER_SUPPORT = 'customer_support', // Address customer issues
    PRODUCT_DISCOVERY = 'customer_support', // Learn about customer needs
    RENEWAL_DISCUSSION = 'renewal_discussion', // Discuss contract/service renewal
    UPSELL = 'upsell', // Propose additional products or upgrades
    CROSS_SELL = 'cross_sell', // Propose related products or services
    SURVEY_FEEDBACK = 'survey_feedback', // Gather feedback or conduct a survey
    PAYMENT_DISCUSSION = 'payment_discussion', // Address billing/payment issues
    ONBOARDING = 'onboarding', // Guide a new customer through onboarding
    CHECK_IN = 'check_in', // General check-in to maintain rapport
    EVENT_INVITATION = 'event_invitation', // Invite lead/customer to an event
    PARTNERSHIP_DISCUSSION = 'partnership_discussion', // Discuss partnership opportunities
    ISSUE_ESCALATION = 'issue_escalation', // Handle escalated issues
    TRAINING_SESSION = 'training_session', // Conduct a training session
    CONTRACT_NEGOTIATION = 'contract_negotiation', // Negotiate contract terms
    CASE_FOLLOW_UP = 'case_follow_up', // Follow up on a support case
    OTHER = 'other', // Any other purpose not covered by above
}