import { debugText } from "../../Classes & Functions/Mini-Functions";
import { Editor } from "../../Editor/Editor";
import { FrameComponent } from "../../Editor/FrameLogic/FrameComponent";
import SimpleCommand from "../SimpleCommand";

export default class ChangeFrameParent extends SimpleCommand{

    private frame: string;
    private newParent: string;
    private oldParent: string;
    private frameChildren: string[];

    public constructor(frame : FrameComponent|string, newParent: FrameComponent|string){
        super();

        if(typeof(frame) === "string"){
            this.frame=frame;
        }
        else{
            this.frame =frame.getName();
        }

        if(typeof(newParent) === "string"){
            this.newParent = newParent;
        }
        else{
            this.newParent = newParent.getName();
        }

    }

    public pureAction(): void {
        
        const projectTree = Editor.GetDocumentEditor().projectTree;
        const frame = projectTree.findByName(this.frame);

        if(typeof(frame) === "undefined"){
            debugText("Could not find frame.");
            return;
        }

        const parent = projectTree.findByName(this.newParent);
        if(typeof(parent) === "undefined"){
            debugText("Could not find parent.");
            return;
        }

        this.oldParent = frame.getParent().getName();
        this.frameChildren = frame.getChildren().map((it : FrameComponent) => it.getName());
        parent.makeParentTo(frame);

    }

    public undo(): void{

        const command = new ChangeFrameParent(this.frame, this.oldParent);
        command.pureAction();

        const projectTree = Editor.GetDocumentEditor().projectTree;
        const parent = projectTree.findByName(this.frame);
        if(typeof(parent) === "undefined"){
            debugText("Could not find newly regenerated frame.");
            return;
        }

        for(const frameName of this.frameChildren){

            const frame = projectTree.findByName(frameName);
            if(typeof(frame) === "undefined") continue;
            parent.makeParentTo(frame);

        }

        super.undo();
        debugText("Undid frame change parent.");
    }

    public redo(): void{
        super.redo();
        debugText("Redid frame change height.");
    }

}