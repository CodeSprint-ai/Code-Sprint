import { $Enums, User_Account_Providers } from '@prisma/client';

export class AccountProvidersEntity implements User_Account_Providers {
  id: string;
  user_id: string;
  provider: $Enums.user_account_provdiers;
  createdAt: Date;
  updatedAt: Date;
}
