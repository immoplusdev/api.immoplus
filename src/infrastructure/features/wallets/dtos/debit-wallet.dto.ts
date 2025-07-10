import { ApiProperty } from "@/core/domain/common/docs";
import { TransactionSource, WalletOperators } from "@/core/domain/wallet";
import { IsNumber, IsUUID } from "class-validator";

export class DebitWalletDto {
   @ApiProperty({ format: "uuid", required: true })
       @IsUUID()
       ownerId: string;
   
       @ApiProperty({ type: Number, required: true })
       @IsNumber()
       amount: number;
   
       @ApiProperty({ type: "enum", enum: TransactionSource,  required: false })
       source?: TransactionSource;
       
       @ApiProperty({ format: "uuid", required: false })
       @IsUUID()
       sourceId?: string;
   
       @ApiProperty({ required: false, default: "XOF" })
       currency?: string;
   
       @ApiProperty({ type: "enum", enum: WalletOperators,  required: false })
       operator?: WalletOperators;
   
       @ApiProperty({type: String, required: false })
       note?: string;
}