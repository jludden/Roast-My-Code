
export default class RoastComment 
{
    // public selectedText: string;
    public commentText: string;
    constructor(public lineNumber: number, public selectedText: string){

    }

    //     public function submit: (text: string) => void;

    // tslint:disable-next-line:no-empty
    public submit(text: string) {
        
    }
}

export interface ICommentList {
    data: RoastComment[]
}