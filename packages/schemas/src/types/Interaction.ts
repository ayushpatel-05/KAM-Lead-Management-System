export enum InteractionType {
    CALL = 'call',
    ORDER = 'order',
  }
  
  export enum InteractionSubType {
    INITIAL = 'initial',
    FOLLOW_UP = 'follow-up',
    FEEDBACK = 'feedback',
    NEW_ORDER = 'new_order',
    REPEAT_ORDER = 'repeat_order',
  }
  
  export enum InteractionMethod {
    PHONE = 'phone',
    EMAIL = 'email',
    CHAT = 'chat',
    IN_PERSON = 'in-person',
  }
  
  export enum Outcome {
    POSITIVE = 'positive',
    NEUTRAL = 'neutral',
    NEGATIVE = 'negative',
  }