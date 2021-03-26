import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiImplicitQuery,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { SubscriptionDto } from './dto/subscription.dto';
import { SubscriptionService } from './subscription.service';

import { AuthGuard } from '@nestjs/passport';
import { validateOrReject } from 'class-validator';
import { PaginationOptionDto } from './dto/pagination-option.dto';
import { BadRequestException } from '../exceptions/bad-request.exception';

@Controller('subscriptions')
@ApiUseTags('Subscriptions')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @ApiOperation({
    title: 'Create Subscriptions',
    description: 'Create new subscriptions',
  })
  @ApiCreatedResponse({
    description: 'The rule has been successfully created.',
    type: SubscriptionDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized error.' })
  @UsePipes(ValidationPipe)
  createSubscription(
    @Body() subscription: SubscriptionDto,
  ): Promise<SubscriptionDto> {
    return this.subscriptionService.addNewSubscription(subscription);
  }

  @Delete('/:subscriptionId')
  @ApiOperation({
    title: 'Cancel Subscriptions',
    description: 'Cancel existing subscriptions',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized error.' })
  cancelSubscription(
    @Param('subscriptionId') subscriptionId: string,
  ): Promise<SubscriptionDto> {
    return this.subscriptionService.cancelSubscription(subscriptionId);
  }

  @Get('/:subscriptionId')
  @ApiOperation({
    title: 'Get subscription detail',
    description: 'Get details of a existing subscription',
  })
  @ApiOkResponse({
    type: SubscriptionDto,
    isArray: false,
    description: 'Get details of a existing subscription',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized error.' })
  subscriptionDetail(
    @Param('subscriptionId') subscriptionId: string,
  ): Promise<SubscriptionDto> {
    return this.subscriptionService.subscriptionDetail(subscriptionId);
  }

  @Get()
  @ApiOperation({
    title: 'Get all subscriptions',
    description: 'Get all subscriptions',
  })
  @ApiOkResponse({
    type: SubscriptionDto,
    isArray: true,
    description: 'return a list of subscription',
  })
  @ApiImplicitQuery({
    name: 'sizePage',
    required: false,
    type: Number,

    description: 'sizePage',
  })
  @ApiImplicitQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'page',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized error.' })
  async getAllSubscription(
    @Query('sizePage', ParseIntPipe) sizePage: number,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<SubscriptionDto[]> {
    const pagination: PaginationOptionDto = new PaginationOptionDto(
      sizePage,
      page,
    );
    try {
      await validateOrReject(pagination);
    } catch (error) {
      throw new BadRequestException(JSON.stringify(error[0].constraints));
    }
    return this.subscriptionService.getAllSubscription(pagination);
  }
}
