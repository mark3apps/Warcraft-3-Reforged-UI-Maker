import { ICallableDivInstance } from "../Classes & Functions/ICallableDivInstance";
import { Editor } from "../Editor/Editor";

export default class Undo implements ICallableDivInstance{

    public run() : void{

        Editor.GetDocumentEditor().changeStack.undo();

    }
    
}