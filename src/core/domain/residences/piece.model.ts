import { OmitMethods } from "@/lib/ts-utilities";

export class Piece {
  nom: string;
  nombre: number;
  constructor(data?: OmitMethods<Piece>) {
    if (data) Object.assign(this, data);
  }
}
