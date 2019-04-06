import * as React from "react";
// import  '../../node_modules/color-themes-for-google-code-prettify/dist/themes/github.min.css'
import '../App.css';
// import '../google-code-prettify/prettify';

// import '../prettifyTypes';
// import * as prettify from './google-code-prettify/prettify';

// import * as prettify from '../google-code-prettify/prettify.js';
import * as prettify from 'code-prettify'
import SyntaxHighlighter from 'react-syntax-highlighter'
import Comment from './Comment'
import SubmitComment from './SubmitCommentForm';
import myRenderer from './SyntaxRenderer'



// import IGithubData from './CommentableCode';
// import IGithubRepo from './CommentableCode';

export interface IDocumentBodyProps {
    name: string, // github data - refactor to new interface
    content: string,
    onSubmitComment: ((details: Comment) => void) // handler for submitting a new comment
}

interface IDocumentBodyState {
    clicksCnt: number,
    comments: Comment[],
    currentlySelected: boolean,
    data: string
}

// interface IPrettifyJS {
//     prettyPrint(): void
// }

// declare global {
//     interface IWindow {
//       prettyprint(): void
//     }
// }  

export default class DocumentBody extends React.Component<IDocumentBodyProps, IDocumentBodyState>
{      
    public state : IDocumentBodyState = {
        clicksCnt: 0,
        comments: [],
        currentlySelected: false,
        data: "nothing"
    }

    public async componentDidMount() {
         this.runCodePrettify(); // todo serve the CSS file
     }

    public componentDidUpdate() {
        prettify.prettyPrint();
    }

    public render() {
        const decoded = atob(this.props.content);
        return (
            <div
                onMouseUp={this.onMouseUp}
                onDoubleClick={this.onDoubleClick}>
                <button onClick={this.handleButtonPress}>Add Click</button>
                <h3> number of clicks: {this.state.clicksCnt} </h3>
                <pre> currently selected: {String(this.state.currentlySelected)}</pre> 
                <div>
                    {this.state.currentlySelected && <SubmitComment comment={this.state.comments[0]} onSubmitComment={this.props.onSubmitComment}/>}
                </div>
                <pre> comments selected: {this.getComments()}</pre> 
                
                <h2> react-syntax-highlighter (doc-body)</h2>
                <div id="doc-body">
                {/* possibly want to use a ref here https://reactjs.org/docs/refs-and-the-dom.html */}
                <SyntaxHighlighter language="kotlin" className="left-align" showLineNumbers={true} renderer={myRenderer}>{decoded}</SyntaxHighlighter>
                </div>

                <h2> code-prettifier </h2>
                <pre className="prettyprint linenums">
                    {decoded}
                </pre>
                <h2> code-prettifier 2</h2>
                <pre className="prettyprint">
                    {decoded}
                </pre>
                
                
            </div>
        );
    }
      
    
    private onMouseUp = (event: React.SyntheticEvent<EventTarget>) => {
        event.preventDefault();
        // debounce(() => {
        //   if (this.doucleckicked) {
        //     this.doucleckicked = false;
        //     this.dismissMouseUp++;
        //   } else if(this.dismissMouseUp > 0) {
        //     this.dismissMouseUp--;
        //   } else {
        //     this.mouseEvent.bind(this)();
        //   }
        // }, 200).bind(this)();
        this.checkTextSelected();
    }

    private onDoubleClick = (event: React.SyntheticEvent<EventTarget>) => {
        this.setState({clicksCnt : this.state.clicksCnt + 1});
        this.checkTextSelected();
    }

    private checkTextSelected = () => {
        let text = '';
        if (window.getSelection) {
            text = window.getSelection().toString();

            
        } 

        if(!text || !text.length) {
            this.setState({currentlySelected: false})
            return false;
        }
        // const range = window.getSelection().getRangeAt(0);
        // const startContainerPosition = range.startContainer.nodeValue   
        // const endContainerPosition = parseInt(range.endContainer.parentNode.dataset.position, 10);
        
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = window.getSelection().getRangeAt(0);
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(document.getElementById("doc-body") as Node);
            // preCaretRange.selectNodeContents(range.startContainer);

            preCaretRange.setEnd(range.startContainer, range.startOffset);
            const start = preCaretRange.toString().length;
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            const end = preCaretRange.toString().length;

            const comments = this.state.comments.concat(new Comment(start, end));
            this.setState({currentlySelected: true})
            this.setState({comments})
        }




    //  const startContainerPosition = parseInt(range.startContainer.parentNode.dataset.position, 10);
    //  const endContainerPosition = parseInt(range.endContainer.parentNode.dataset.position, 10);

    // const startHL = startContainerPosition < endContainerPosition ? startContainerPosition : endContainerPosition;
    // const endHL = startContainerPosition < endContainerPosition ? endContainerPosition : startContainerPosition;

    // const rangeObj = new Range(startHL, endHL, text, Object.assign({}, this.props, {ranges: undefined}));

        // this.props.onTextHighlighted(rangeObj);


        return true;
    }

    private getComments() : string {
        let text = "";
        let count = 0;
        for (const comment of this.state.comments) {
            text = text.concat(`\n ${count}: ${comment.startIndex}-${comment.endIndex}`);
            count++;
        }

        return text;
    }
        
    private handleButtonPress = () => {
        this.setState({clicksCnt : this.state.clicksCnt + 1});
      };

    // todo customize CSS or use theme
    private runCodePrettify() {
        prettify.prettyPrint();

        // ./src/google-code-prettify/prettify');
        // const prettify = require('../google-code-prettify/prettify');
        // prettify.print();
        
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        
        // this version automatically appends CSS 
        script.src = 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js';
        // append script to document head
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
        
        // Notes:
        // note you can pass in a skin here, but there aren't many options
        // script.src = 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js?skin=sunburst';

        // todo will need to use new CDN at some point:
        //        script.src = 'https://cdn.jsdelivr.net/google/code-prettify/master/loader/run_prettify.js';
        //
        // script.src = 'https://cdn.rawgit.com/google/code-prettify/master/loader/prettify.js';        
    }
}