import { ApiProperty } from "@nestjs/swagger";

export class ProductDTO {
    @ApiProperty({ description: "Product ID" })
    _id: string

    @ApiProperty({ description: "name of Product", example: "Mouse" })
    name: string

    @ApiProperty({ description: "Product Description" })
    originalDescription: string

    @ApiProperty({ description: "Product Price" })
    price: string

    @ApiProperty({ description: "Product Category" })
    category: string

    @ApiProperty({
        description: "created Date", type: Number, default: new Date()
    })
    "createdAt": Date

    @ApiProperty({
        description: "Updating Date", type: Number, default: new Date()
    })
    "updatedAt": Date

}