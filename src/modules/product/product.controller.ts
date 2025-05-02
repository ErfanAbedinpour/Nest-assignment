import { Controller, Delete, Get, Patch, Post } from "@nestjs/common";

@Controller("product")
export class ProductController {

    @Post()
    createProduct() { }


    @Get()
    getAllProduct() { }


    @Get(":id")
    getProductById() { }


    @Delete(":id")
    deleteProduct() { }


    @Patch(":id")
    updateProduct() { }
}