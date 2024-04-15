import { DataListItem } from '@/types/global';

export { DataListItem };

export interface FormData {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
  };
  spec: {
    description: string;
    displayName: string;
    type: string;
    externalConfig: Record<
      string,
      {
        clientID: string;
        clientSecret: string;
        groups?: string[];
      }
    >;
  };
  status: {
    loginWithPassword: boolean;
  };
}

export default {};
