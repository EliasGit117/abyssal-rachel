import { os } from '@orpc/server';
import { TPermissionsInput } from '@/lib/auth';

interface IORPCMetadata {
  anonymous?: boolean;
  permissions?: TPermissionsInput;
}


export const base = os
  .$meta<IORPCMetadata>({})
  .$context<{ headers: Headers }>();