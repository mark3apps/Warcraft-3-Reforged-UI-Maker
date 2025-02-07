import { Queue } from 'queue-typescript';
import { CustomImage } from './FrameLogic/CustomImage';
import { FrameComponent } from './FrameLogic/FrameComponent';
import { FrameBuilder } from './FrameLogic/FrameBuilder';
import { FrameType } from './FrameLogic/FrameType';
import { Editor } from './Editor';

export class ProjectTree implements IterableIterator<FrameComponent>{

    public readonly rootFrame : FrameComponent;
    public readonly panelTree : HTMLElement;
    private selectedFrame : FrameComponent;

    public constructor(){

        const originBuilder : FrameBuilder = new FrameBuilder();

        originBuilder.name = 'Origin';
        originBuilder.type = FrameType.ORIGIN;
        originBuilder.width = 0;
        originBuilder.height = 0;
        originBuilder.x = 0;
        originBuilder.y = 0;

        this.rootFrame = new FrameComponent(originBuilder);
        this.rootFrame.SetName('Origin')
        this.selectedFrame = this.rootFrame;

        this.panelTree = document.getElementById('panelTreeView');

        for (let i = this.panelTree.children.length - 1; i >= 0; i--) {

            this.panelTree.removeChild(this.panelTree.children[i]);

        }

        this.panelTree.appendChild(this.rootFrame.treeElement);

    }

    public AppendToSelected(newFrame : FrameBuilder) : void{
        if (this.selectedFrame == null) this.rootFrame.CreateAsChild(newFrame);
        else this.selectedFrame.CreateAsChild(newFrame);
    }

    public RemoveFrame(frameComponent : FrameComponent) : void{
        frameComponent.Destroy();
    }

    public GetSelectedFrame() : FrameComponent{
        return this.selectedFrame;
    }

    public Select(frame : FrameComponent | CustomImage | HTMLImageElement | HTMLElement) : void{

        //should go to workspace class?
        if(this.selectedFrame != null) this.selectedFrame.image.element.style.outlineColor = "green"

        if(frame instanceof FrameComponent) this.selectedFrame = frame;
        else if(frame instanceof CustomImage) this.selectedFrame = frame.frameComponent
        else if(frame instanceof HTMLImageElement) this.selectedFrame = CustomImage.GetCustomImageFromHTMLImageElement(frame).frameComponent;
        else if(frame instanceof HTMLElement) this.selectedFrame = FrameComponent.GetFrameComponent(frame);
        else{
            this.selectedFrame = null;
            return;
        } 
        
        this.selectedFrame.image.element.style.outlineColor = 'red';

        Editor.GetDocumentEditor().parameterEditor.UpdateFields(this.selectedFrame);

    }

    //Iterator
    private iteratorQueue : Queue<FrameComponent>;

    public GetIterator() : IterableIterator<FrameComponent>{

        this.iteratorQueue = new Queue<FrameComponent>();
        const tempQueue = new Queue<FrameComponent>();
        let currentNode : FrameComponent;

        this.iteratorQueue.enqueue(this.rootFrame);
        tempQueue.enqueue(this.rootFrame);

        do{
            currentNode = tempQueue.dequeue();

            for(const child of currentNode.GetChildren()){
                tempQueue.enqueue(child);
                this.iteratorQueue.enqueue(child);
            }

        }while(tempQueue.front != null);

        return this;
    }

    [Symbol.iterator](): IterableIterator<FrameComponent> {
        return this;
    }

    public next(): {done: boolean, value : FrameComponent}{
        const returnValue = this.iteratorQueue.dequeue();

        return {done :(returnValue == null)?(true):(false),
                value: returnValue};

    }
}