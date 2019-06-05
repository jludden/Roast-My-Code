import * as React from "react";
// import  '../../node_modules/color-themes-for-google-code-prettify/dist/themes/github.min.css'
import "../App.css";

// import '../google-code-prettify/prettify';

// import '../prettifyTypes';
// import * as prettify from './google-code-prettify/prettify';
// import * as prettify from '../google-code-prettify/prettify.js';
// import * as prettify from 'code-prettify'
import SyntaxHighlighter from "react-syntax-highlighter";
// import { kotlin } from 'react-syntax-highlighter/dist/languages/hljs'
import { github } from "react-syntax-highlighter/dist/styles/hljs";

import { SubmitCommentResponse } from "./CommentableCode";
import RoastComment from "./RoastComment";
import DocumentCommentsView from "./DocumentCommentsView";
import SubmitComment from "./SubmitCommentForm";

import "rbx/index.css";
import { Column, Container, Section } from "rbx";


// import { LineRenderer } from './SyntaxRenderer';

// import myRenderer from './SyntaxRenderer' todo delete that whole class, have function local
// import IGithubData from './CommentableCode';
// import IGithubRepo from './CommentableCode';

export interface IDocumentBodyProps {
  name: string; // github data - refactor to new interface
  content: string;
  comments: RoastComment[]; // todo why props and state
  onSubmitComment: (comment: RoastComment) => Promise<SubmitCommentResponse>; // handler for submitting a new comment
  onEditComment: (comment: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>
}

interface IDocumentBodyState {
  clicksCnt: number;
  currentlySelected: boolean;
  selectedLine: number;
  selectedText: string;
  lineRefs: HTMLDivElement[]; 
}

export default class DocumentBody extends React.Component<
  IDocumentBodyProps,
  IDocumentBodyState
> {
  public state: IDocumentBodyState = {
    clicksCnt: 0,
    currentlySelected: false,
    selectedLine: -1,
    selectedText: "",
    lineRefs: []
  };

  // public async componentDidMount() {
  //      this.runCodePrettify(); // todo serve the CSS file
  //  }

  // public componentDidUpdate() {
  //     prettify.prettyPrint();
  // }
  //`flex-item ${App-body}`}

  public render() {
    const decoded = atob(this.props.content);
    return (
      <div onMouseUp={this.onMouseUp} onDoubleClick={this.onDoubleClick}>
        {/* <button type="button" onClick={this.handleButtonPress}>Add Click</button>
        <h3> number of clicks: {this.state.clicksCnt} </h3>
        <pre> currently selected: {String(this.state.currentlySelected)}</pre>
        <SubmitComment
          comment={this.props.comments[0]}
          isCurrentlySelected={this.state.currentlySelected}
          selectedText={this.state.selectedText}
          onSubmitComment={this.props.onSubmitComment}
        />
        <pre> comments selected: {this.getComments()}</pre> */}

        <Section backgroundColor = "primary" gradient="warning">
                <Container color="primary">
        <Column.Group>
          <Column size="three-quarters">
              <SyntaxHighlighter
                language="kotlin"
                style={github}
                className="left-align"
                showLineNumbers={true}
                renderer={this.renderSyntaxLines}
              >
                {decoded}
              </SyntaxHighlighter>
          </Column>
          <Column size="one-quarter" backgroundColor="primary">
            <DocumentCommentsView
              lineNumberMap={this.groupCommentsByLineNumber(this.props.comments)}
              onEditComment={this.props.onEditComment}
              lineRefs={this.state.lineRefs}/>
          </Column>
        </Column.Group>
        </Container>
        </Section>


{/* 
        <div className="flex-container">
          <div id="doc-body" className={`flex-item App-body`}> */}
            {/* possibly want to use a ref here https://reactjs.org/docs/refs-and-the-dom.html */}
            {/* <SyntaxHighlighter language="kotlin" style={github} className="left-align" showLineNumbers={true} renderer={()=>{LineRenderer()}}>{decoded}</SyntaxHighlighter> */}
            {/* <SyntaxHighlighter
              language="kotlin"
              style={github}
              className="left-align"
              showLineNumbers={true}
              renderer={this.renderSyntaxLines}
            >
              {decoded}
            </SyntaxHighlighter>
          </div>
          <DocumentCommentsView
            lineNumberMap={this.groupCommentsByLineNumber(this.props.comments)}
            onEditComment={this.props.onEditComment}
            lineRefs={this.state.lineRefs}/>
        </div> */}

        {/* <h2> code-prettifier </h2>
                <pre className="prettyprint linenums">
                    {decoded}
                </pre>
                <h2> code-prettifier 2</h2>
                <pre className="prettyprint">
                    {decoded}
                </pre>
                 */}
      </div>
    );
  }

      // Group comments into Comment Containers based their associated line number TODO this could be state or something
  private groupCommentsByLineNumber = (comments: RoastComment[]) =>
  {
        const lineNumberMap = new Map<number|undefined, RoastComment[]>();
        comments.map((comment: RoastComment) => {
          var line: RoastComment[] = lineNumberMap.get(comment.data.lineNumber) || [];
          line.push(comment);
          lineNumberMap.set(comment.data.lineNumber, line);    
        });
        return lineNumberMap;
  }

  // track the refs for each line in the document
  // these can then be used to find the exact positioning of each line
  // private lineRefs: HTMLDivElement[] = []; // todo to be state or not?
  private setLineRef = (el: HTMLDivElement) => 
  {
    const lineNumber = parseInt(el.dataset.index || "");
    const lineRefs =  this.state.lineRefs;
    lineRefs[lineNumber] = el;
    this.setState({lineRefs});   
  }


  // render the rows of Syntax Highlighted elements
  private renderSyntaxLines = ({
    rows,
    stylesheet,
    useInlineStyles
  }: {
    rows?: any;
    stylesheet?: any;
    useInlineStyles?: any;
  }): JSX.Element => {
    const createElement = require("react-syntax-highlighter/dist/create-element")
      .default; // todo add to node_modules\@types\react-syntax-highlighter\index.d.t

    // using the index as a key should be okay in this case, we are never insertering or deleting elements
    return rows.map((node: any, i: number) =>       
      <div key={i} data-index={i} onClick={this.handleLineClicked} ref={this.setLineRef}>
      {/* todo!!! don't know about passing this state down here... is it causing a re-render for every line? */}
        <SubmitComment
          comment={this.props.comments[this.props.comments.length-1]}
          isCurrentlySelected={this.state.selectedLine === i}
          onSubmitComment={this.props.onSubmitComment}
          selectedText={this.state.selectedText}
        />
        {createElement({
          key: `code-segement${i}`,
          node,
          stylesheet,
          useInlineStyles
        })}
      </div>
    );
  };

  private handleLineClicked = (event: React.SyntheticEvent<EventTarget>) => { // todo if no selection also allow adding comment?
    // const lineNumber = (event.currentTarget as HTMLDivElement).dataset.index;

    // // tslint:disable-next-line:no-console
    // console.log(lineNumber);

    // if (lineNumber) {
    //   this.setState({ selectedLine: +lineNumber });
    // }
  };

  private onMouseUp = (event: React.SyntheticEvent<EventTarget>) => {
    event.preventDefault();

    const lineNumber = (event.target as HTMLDivElement).dataset.index;

    // tslint:disable-next-line:no-console
    console.log(lineNumber);


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
  };

  private onDoubleClick = (event: React.SyntheticEvent<EventTarget>) => {
    this.checkTextSelected();
  };

  private checkTextSelected = () => {
    let text = "";
    const selection = window.getSelection();
    if (selection) {
      text = selection.toString();
    }

    if (!text || !text.length) {
      this.setState({ currentlySelected: false });
      return false;
    }
    // const range = window.getSelection().getRangeAt(0);
    // const startContainerPosition = range.startContainer.nodeValue
    // const endContainerPosition = parseInt(range.endContainer.parentNode.dataset.position, 10);

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {

        // tslint:disable-next-line:no-console
        console.log(`selected text: ${text}`);

    //   const range = sel.getRangeAt(0);
    //   const preCaretRange = range.cloneRange();
    //   preCaretRange.selectNodeContents(document.getElementById(
    //     "doc-body"
    //   ) as Node);

       const index = this.findFirstLineNumber(sel);

      // preCaretRange.selectNodeContents(range.startContainer);

    //   preCaretRange.setEnd(range.startContainer, range.startOffset);
    //   const start = preCaretRange.toString().length;
    //   preCaretRange.setEnd(range.endContainer, range.endOffset);
    //   const end = preCaretRange.toString().length;

    //     // const text2 = range.startContainer as Text

            //   tslint:disable-next-line:no-console
              console.log(`index: ${index}`);

              // make the comment submission form visible
              if (index >= 0) {
                  this.setState({ selectedLine: +index });
                }

     // const comments = this.props.comments.concat(new RoastComment(index, text));
      this.setState({ currentlySelected: true, selectedText: text });
     // this.setState({ comments });
    }

    //  const startContainerPosition = parseInt(range.startContainer.parentNode.dataset.position, 10);
    //  const endContainerPosition = parseInt(range.endContainer.parentNode.dataset.position, 10);

    // const startHL = startContainerPosition < endContainerPosition ? startContainerPosition : endContainerPosition;
    // const endHL = startContainerPosition < endContainerPosition ? endContainerPosition : startContainerPosition;

    // const rangeObj = new Range(startHL, endHL, text, Object.assign({}, this.props, {ranges: undefined}));

    // this.props.onTextHighlighted(rangeObj);

    return true;
  };

  private getComments(): string {
    let text = "";
    let count = 0;
    for (const comment of this.props.comments) {
      text = text.concat(
        `\n [${count}] line ${comment.data.lineNumber}: ${comment.data.selectedText}`
      );
      count++;
    }

    return text;
  }

  private handleButtonPress = () => {
    this.setState({ clicksCnt: this.state.clicksCnt + 1 });
  };

  // unfortunately, although event.currentTarget should return the <div> with attached onclick, we can't rely on that
  // to get us the start position of a selection if multiple lines of text are selected
  // find the closest parent element of the current element satisfying the function
  private closestElement = (el: HTMLElement|null, matchFn: (el: HTMLElement) => boolean): HTMLElement|null => {
      if(el) {
        return matchFn(el) ? el : this.closestElement(el.parentElement, matchFn);
      }
      return null;
  }

  // pass the clicked-on selection object and walk up the dom tree to find the line number
  private findFirstLineNumber(sel: Selection): number {
    const initialElement = sel.getRangeAt(0).startContainer.parentElement;

    const myDiv = this.closestElement(initialElement, (el: HTMLElement) => {
        return el.dataset.index != null;
    });

    if (myDiv) {
        const lineNumber = (myDiv as HTMLDivElement).dataset.index;
        return lineNumber ? +lineNumber : -1;
    }
    return -1;
  }



  // // todo customize CSS or use theme
  // private runCodePrettify() {
  //     prettify.prettyPrint();

  //     // ./src/google-code-prettify/prettify');
  //     // const prettify = require('../google-code-prettify/prettify');
  //     // prettify.print();

  //     const script = document.createElement('script');
  //     script.type = 'text/javascript';
  //     script.async = true;

  //     // this version automatically appends CSS
  //     script.src = 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js';
  //     // append script to document head
  //     (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);

  //     // Notes:
  //     // note you can pass in a skin here, but there aren't many options
  //     // script.src = 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js?skin=sunburst';

  //     // todo will need to use new CDN at some point:
  //     //        script.src = 'https://cdn.jsdelivr.net/google/code-prettify/master/loader/run_prettify.js';
  //     //
  //     // script.src = 'https://cdn.rawgit.com/google/code-prettify/master/loader/prettify.js';
  // }
}
