import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { ProviderEnum } from 'src/auth/enum/ProviderEnum';

export interface IUser {
    _id?: Types.ObjectId;
    email: string;
    name?: string;
    password?: string;
    isVerified?: boolean;
    emailVerificationToken?: string;
    passwordResetToken?: string | null;
    passwordResetExpires?: Date | null;
    provider: ProviderEnum;
    refreshToken?: string | null;
}
export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User implements IUser {
    // _id is automatically added by Mongoose

    @Prop({ unique: true, required: true })
    email: string;

    @Prop()
    name: string;

    @Prop()
    password?: string;

    @Prop({ default: false })
    isVerified: boolean;

    @Prop()
    emailVerificationToken?: string;

    @Prop({ type: String, default: null })
    passwordResetToken?: string | null;

    @Prop({ type: Date, default: null })
    passwordResetExpires?: Date | null;

    @Prop({ default: ProviderEnum.LOCAL })
    provider: ProviderEnum;

    @Prop({ type: String, default: null })
    refreshToken?: string | null;
}


export const UserSchema = SchemaFactory.createForClass(User);
