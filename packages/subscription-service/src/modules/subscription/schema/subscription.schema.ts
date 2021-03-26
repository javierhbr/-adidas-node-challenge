import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GenderEnum } from '../../common/gender.enum';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type SubscriptionDocument = Subscription & Document;

@Schema()
export class Subscription {
  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  firstName?: string;

  @Prop({
    type: String,
    enum: GenderEnum,
    required: false,
  })
  gender?: GenderEnum;

  @Prop({ required: true })
  dateOfBird: Date;

  @Prop({ required: true })
  isConsent: boolean;

  @Prop({ required: true })
  newsletterId: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

SubscriptionSchema.plugin(mongoosePaginate);
SubscriptionSchema.index({ email: 1 }, { unique: false });
