export interface SelectOptionValue {
  label: string;
  borderColor: string;
  textColor: string;
  bgColor: string;
}

export interface CustomField {
  id: string;
  name: string;
  slug: string;
  type: 'string' | 'multiline' | 'datetime' | 'file' | 'select' | 'number' | 'boolean';
  icon: string;
  iconColor: string;
  required: boolean;
  description?: string;
  selectOptions?: SelectOptionValue[];
  allowMultiple?: boolean;
  slugLocked?: boolean;
}

export interface ActionActivity {
  type: 'email' | 'email_with_attachments' | 'telegram' | 'webhook';
  label: string;
}

export interface CustomAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  targetType: 'user' | 'team' | 'status' | 'custom';
  activities: ActionActivity[];
}
