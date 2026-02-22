import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { Product, Prisma } from './generated/prisma/client.js';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async product(
    productWhereUniqueInput: Prisma.ProductWhereUniqueInput,
  ): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: productWhereUniqueInput,
    });
  }

  async products(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProductWhereUniqueInput;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }): Promise<Product[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.product.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createProduct(data: any) {
    return this.prisma.product.create({
      data: {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        category: data.category,
        companyId: data.companyId,
        // AQUÍ sucede la magia de la inserción múltiple
        ProductVariant: {
          create: data.variants.map((v: any) => ({
            id: crypto.randomUUID(),
            sku: v.sku,
            size: v.size,
            color: v.color,
            salePrice: parseFloat(v.salePrice),
            costPrice: parseFloat(v.costPrice || 0),
            barcode: v.barcode,
          })),
        },
      },
      // Esto hace que el objeto devuelto incluya las variantes creadas
      include: { ProductVariant: true } 
    });
  }

  async updateProduct(params: {
    where: Prisma.ProductWhereUniqueInput;
    data: Prisma.ProductUpdateInput;
  }): Promise<Product> {
    const { data, where } = params;
    return this.prisma.product.update({
      data,
      where,
    });
  }

  async deleteProduct(where: Prisma.ProductWhereUniqueInput): Promise<Product> {
    return this.prisma.product.delete({
      where,
    });
  }

  async create(data: any) {
    return this.prisma.product.create({
      data: {
        id: crypto.randomUUID(), // O deja que la DB lo genere si es @default(uuid())
        name: data.name,
        description: data.description,
        category: data.category,
        companyId: data.companyId, // Asegúrate de enviar un ID de compañía válido
        ProductVariant: {
          create: data.variants.map((v: any) => ({
            id: crypto.randomUUID(),
            sku: v.sku,
            size: v.size,
            salePrice: parseFloat(v.salePrice),
          })),
        },
      },
    });
  }
}
