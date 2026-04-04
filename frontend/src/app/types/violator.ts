export type ViolatorDynamicColumnKey = string;

export interface Violator {
  id: string;
  name: string;
  email: string;
  samAccountName: string;
  domain: string;
  [key: string]: string | Record<string, string> | undefined;
  дополнительныеПоля?: Record<string, string>;
}
