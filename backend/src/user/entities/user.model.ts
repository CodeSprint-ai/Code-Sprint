import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
    _id: MongooseSchema.Types.ObjectId;

    @Prop({ unique: true, required: true })
    email: string;

    @Prop()
    name: string;

    @Prop()
    password: string;

    @Prop({ default: false })
    isVerified: boolean;

    @Prop()
    emailVerificationToken?: string;

    @Prop({ type: String, default: null })
    passwordResetToken?: string | null;

    @Prop({ type: Date, default: null })
    passwordResetExpires?: Date | null;

    @Prop({ default: 'local' })
    provider: 'local' | 'google' | 'github';

    @Prop({ type: String, default: null })
    refreshToken?: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
