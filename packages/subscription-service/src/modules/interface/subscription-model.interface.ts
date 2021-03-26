import { GenderEnum } from '../common/gender.enum';

export interface ISubscriptionModel {
  id?: string;
  email?: string;
  firstName?: string;
  gender?: GenderEnum;
  dateOfBird?: string;
  isConsent?: boolean;
  newsletterId?: string;
}
