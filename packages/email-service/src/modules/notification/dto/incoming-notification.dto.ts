import { ApiModelProperty } from '@nestjs/swagger';
import { NotificationTypeEnum } from '../../common/notification-type.enum';
import { IsIn, IsString, MaxLength } from 'class-validator';

export class IncomingNotificationDto {
  @ApiModelProperty({ type: NotificationTypeEnum })
  @IsIn([
    NotificationTypeEnum.EMAIL,
    NotificationTypeEnum.SMS,
    NotificationTypeEnum.MOBILE_PUSH,
  ])
  notificationType: NotificationTypeEnum;

  @ApiModelProperty()
  @IsString()
  destination: string;

  @ApiModelProperty()
  @IsString()
  @MaxLength(500)
  message: string;
}
