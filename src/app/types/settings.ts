export interface CustomField {
  id: string;
  name: string;
  type: 'string' | 'multiline' | 'datetime' | 'file' | 'select' | 'number' | 'boolean';
  icon: string;
  iconColor: string;
  required: boolean;
  description?: string;
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
