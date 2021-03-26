import { IsNumber, Max, Min } from 'class-validator';

export class PaginationOptionDto {
  @IsNumber()
  @Min(1)
  @Max(100)
  sizePage: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  page: number;

  constructor(sizePage: number, page: number) {
    this.sizePage = sizePage;
    this.page = page;
  }
}
