export default class RoastComment implements IRoastComment {
    id: number; // the id of the comment

    data: {
        lineNumber?: number;
        selectedText?: string;
        author?: string;
        text: string;
    };

    constructor(obj?: IRoastComment) {
        this.id = (obj && obj.id) || -1;
        this.data = {
            author: (obj && obj.data && obj.data.author) || '',
            lineNumber: (obj && obj.data && obj.data.lineNumber) || -1,
            selectedText: (obj && obj.data && obj.data.selectedText) || '',
            text: (obj && obj.data && obj.data.text) || '',
        };
    }

    // constructor(
    //     public ts: number = -1,
    //     lineNumber: number = -1,
    //     selectedText: string = "",
    //     author: string = "anon",
    //     comment: string = "" ) {

    //         this.data = {
    //             lineNumber: lineNumber,
    //             selectedText: selectedText,
    //             author: author,
    //             comment: comment,
    //         }
    // }

    //     public function submit: (text: string) => void;

    // // tslint:disable-next-line:no-empty
    // public submit() {

    // }
}

export interface IRoastComment {
    id?: number; // the id of the comment

    data: CommentInput;
}

export interface CommentInput {
    text: string;
    lineNumber?: number;
    selectedText?: string;
    author?: string;
    createdAt?: string;
    updatedAt?: string;
}

// export interface ICommentPostResponse {
//     data: RoastComment
// }

// export interface ICommentList {
//     data: RoastComment[]
// }
