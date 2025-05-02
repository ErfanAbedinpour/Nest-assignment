import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "../../schemas";
import { ProductRepository } from "./repository/abstract/product.repository";
import { MongoProductRepository } from "./repository/abstract/mongo-product-repository.impl";

@Module({
    imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
    controllers: [ProductController],
    providers: [
        ProductService,
        {
            provide: ProductRepository,
            useClass: MongoProductRepository
        }
    ],
    exports: [ProductService]
})
export class ProductModule { }