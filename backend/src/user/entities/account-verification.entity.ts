import { $Enums, User_Account_Verification } from "@prisma/client";

export class AccountVerificationEntity implements User_Account_Verification{
    id: string;
    code: string;
    type: $Enums.user_verfication;
    user_id: string;
    limit: number;
    createdAt: Date;
    updatedAt: Date;

}