import { GenderEnum } from '../../common/gender.enum';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { ISubscriptionModel } from '../../interface/subscription-model.interface';

export class SubscriptionDto implements ISubscriptionModel {
  @ApiModelPropertyOptional()
  @IsOptional()
  id?: string;

  @ApiModelProperty()
  @IsEmail()
  email: string;

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  firstName?: string;

  @ApiModelPropertyOptional({ type: GenderEnum })
  @IsOptional()
  @IsIn([GenderEnum.FEMALE, GenderEnum.MALE, GenderEnum.NON_INDICATED])
  gender?: GenderEnum;

  @ApiModelProperty({ description: ' Date format yyyy-MM-DD' })
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  dateOfBird: string;

  @ApiModelProperty()
  @IsBoolean()
  isConsent: boolean;

  @ApiModelProperty()
  @IsNotEmpty()
  newsletterId: string;
}
