import { Memento } from "./memento";

export interface Caretaker {
  undo(): unknown;
  add(mement: Memento): unknown;
}
