import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { ProductService } from './product.service.js';
import { User as UserModel } from './generated/prisma/client.js';
import { Product as ProductModel } from './generated/prisma/client.js';

@Controller()
export class AppController {
  constructor(
    private readonly UserService: UserService,
    private readonly productService: ProductService,
  ) {}

  @Get()
  getHello(): string {
    return 'Hello World! this is a test';
  }

  @Get('product/:id')
  async getProductById(@Param('id') id: string): Promise<ProductModel | null> {
    return this.productService.product({ id: String(id) });
  }

  @Get('user/:id')
  async getUserById(@Param('id') id: string): Promise<UserModel | null> {
    return this.UserService.user({ id: String(id) });
  }

  @Get('users')
  async getUsers(): Promise<UserModel[]> {
    return this.UserService.users({});
  }

  @Get('products')
  async getProducts(): Promise<ProductModel[]> {
    return this.productService.products({});
  }

  @Get('filtered-products/:searchString')
  async getFilteredProducts(
    @Param('searchString') searchString: string,
  ): Promise<ProductModel[]> {
    return this.productService.products({
      where: {
        OR: [
          {
            name: { contains: searchString },
          },
          {
            description: { contains: searchString },
          },
        ],
      },
    });
  }

  @Delete('product/:id')
  async deleteProduct(@Param('id') id: string): Promise<ProductModel> {
    return this.productService.deleteProduct({ id: String(id) });
  }
}
