import { FindRepoResults } from '../CommentableCodePage/CommentsGqlQueries';
import { SubmitCommentResponse } from '../CommentableCodePage/CommentableCode';
import { IDocumentCommentProps } from './Document';
import DocumentCommentsView, { UnsubmittedComment } from './DocumentCommentsView';
import SubmitComment from '../SubmitCommentForm';
import RoastComment from '../CommentableCodePage/types/findRepositoryByTitle';
import { firebaseUserToRoastUserName } from '../FirebaseChat/LoggedInStatus';
// import { findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data_comments_data as RoastComment } from '../CommentableCodePage/types/findRepositoryByTitle';
import { Column, Container, Section, Button } from 'rbx';
import SyntaxLine, { createElement } from './SyntaxRenderer';

import 'rbx/index.css';
import * as React from 'react';
import '../../App.css';
// import createElement from 'react-syntax-highlighter/dist/esm/create-element';

// import tomorrow from 'react-syntax-highlighter/dist/styles/prism/tomorrow';
// import ghcolors from 'react-syntax-highlighter/dist/styles/prism/ghcolors';
// import darcula from 'react-syntax-highlighter/dist/styles/prism/darcula';

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
// TODO - use heavy version and won't need to register lang
// or use async version for fastest rendering

// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// import { java } from 'react-syntax-highlighter/dist/languages/hljs';
// import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
// "react-syntax-highlighter/dist/esm/languages/hljs/kotlin"

// import { github } from 'react-syntax-highlighter/dist/styles/hljs';
// import dark from 'react-syntax-highlighter/dist/esm/styles/prism/dark'; // todo
// "react-syntax-highlighter/dist/styles/prism"

// TODO! Register languages: https://github.com/storybookjs/storybook/issues/9279
// also see https://github.com/storybookjs/storybook/blob/b6136e1539c85d253504391a7d3f65e2c1239143/lib/components/src/syntaxhighlighter/syntaxhighlighter.tsx
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import html from 'react-syntax-highlighter/dist/cjs/languages/prism/markup';
import md from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown';
import yml from 'react-syntax-highlighter/dist/cjs/languages/prism/yaml';
import ts from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import properties from 'react-syntax-highlighter/dist/cjs/languages/prism/properties';
// graphql
// java
// json
// markdown
// python
// rust
// ruby
// toml
// swift
// yaml
// java
// javascript
// csharp
// css
// cpp
// c

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('yml', yml);
SyntaxHighlighter.registerLanguage('md', md);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('html', html);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('properties', properties);

// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // todo

// import myRenderer from './SyntaxRenderer' todo delete that whole class, have function local
// import IGithubRepo from './CommentableCode';

export interface IDocumentBodyPropsWithTheme {
    name: string; // github data - refactor to new interface
    content: string;
    comments: RoastComment[];
    onSubmitComment: (comment: RoastComment) => Promise<boolean>;
    onEditComment: (comment: RoastComment, isDelete?: boolean) => Promise<boolean>;
    repoComments: FindRepoResults;
    repoId: string;
    repoTitle: string;
    documentId: string;
    documentTitle: string;
    commentListId: string;
    theme: any;
}

interface IDocumentBodyState {
    clicksCnt: number;
    currentlySelected: boolean;
    selectedLine: number;
    selectedText: string;
    lineRefs: HTMLDivElement[];
    inProgressComment?: UnsubmittedComment;
    selectedPos: any;
    // textHover: any;
}

export interface ICommentGrouping {
    comments: RoastComment[];
    startMinized: boolean;
    inProgress: boolean;
}

// const DocumentBodyContainer = (props: IDocumentBodyPropsWithTheme & IDocumentCommentProps) => {
//     return (
//         <>
//             <DocumentBody {...props} />
//         </>
//     );
// };

// export default DocumentBodyContainer;

export class DocumentBody extends React.Component<
    IDocumentBodyPropsWithTheme & IDocumentCommentProps,
    IDocumentBodyState
> {
    // constructor(props) {
    //     super(props);
    //     // this.textHover = React.createRef();
    // }

    public state: IDocumentBodyState = {
        clicksCnt: 0,
        currentlySelected: false,
        selectedLine: -1,
        selectedText: '',
        lineRefs: [],
        selectedPos: {},
    };

    componentDidMount() {
        const { hash } = window.location;
        const id = hash.replace('#', '');
        setTimeout(() => {
            const element = document.getElementById(id);
            console.log('scrolling to: ' + id + '\n element ' + (element ? 'found' : 'not found'));
            if (element) element.scrollIntoView();
        });
    }

    public render() {
        // mappings for languages that don't match their file endings
        const extMapping: { [key: string]: string } = {
            kt: 'kotlin',
            js: 'javascript',
        };

        const docTitleParts = this.props.documentTitle.split('.');
        const fileEnding = docTitleParts[docTitleParts.length - 1];
        const language = extMapping[fileEnding] || fileEnding;
        const decoded = this.props.content;
        console.log(`detected language for ${this.props.documentTitle} is ${language}`);

        const selectedPos = this.state.selectedPos;

        const hoverStyle: React.CSSProperties = {
            position: 'absolute',
            top: selectedPos.top,
        };

        return (
            <div onMouseUp={this.onMouseUp} onDoubleClick={this.onDoubleClick}>
                <Container color="dark" breakpoint="desktop" backgroundColor="dark">
                    <Column.Group>
                        <Column size="three-quarters" backgroundColor="dark">
                            {decoded && (
                                <div style={{ position: 'relative' }}>
                                    <div id="sel-text-hover" className="hover-modal" style={hoverStyle}>
                                        <span>why hello there</span>
                                    </div>
                                    <SyntaxHighlighter
                                        language={language}
                                        style={this.props.theme}
                                        className="left-align"
                                        showLineNumbers
                                        renderer={this.renderSyntaxLines}
                                    >
                                        {decoded}
                                    </SyntaxHighlighter>
                                </div>
                            )}
                        </Column>
                        <Column size="one-quarter" backgroundColor="light">
                            <DocumentCommentsView
                                authenticated={this.props.authenticated}
                                lineNumberMap={this.groupCommentsByLineNumber(this.props.comments)}
                                lineRefs={this.state.lineRefs}
                                inProgressComment={this.state.inProgressComment}
                                repoId={this.props.repoId}
                                repoTitle={this.props.repoTitle}
                                documentId={this.props.documentId}
                                documentTitle={this.props.documentTitle}
                                commentListId={this.props.commentListId}
                                onSubmitComment={this.props.onSubmitComment}
                                onSubmitCommentFinish={this.onSubmitCommentFinish}
                                onEditComment={this.props.onEditComment}
                                handleCommentAdd={this.handleCommentAdd}
                                user={this.props.user}
                            />
                        </Column>
                    </Column.Group>
                </Container>
            </div>
        );
    }

    // get rid of the in-progress comment when the submission goes through or is cancelled
    private onSubmitCommentFinish = () => {
        if (this.state.inProgressComment !== undefined) {
            this.setState({
                inProgressComment: undefined,
            });
        }
    };

    // Group comments into Comment Containers based their associated line number
    private groupCommentsByLineNumber = (comments: RoastComment[]) => {
        const lineNumberMap = new Map<number, ICommentGrouping>();
        const { hash } = window.location; // definitely make the linked comment expando
        const elementId = hash.replace('#', '');
        const parts = elementId ? elementId.split('~') : [];
        const selectedId = parts[parts.length - 1];
        selectedId && console.log('Looking to force comment ' + selectedId + ' to be open and scrolled to');

        let previousLineNum = -10;
        comments.map((comment: RoastComment) => {
            const lineNumber = comment.lineNumber || 0;
            const line = lineNumberMap.get(lineNumber) || {
                comments: [],
                startMinized: lineNumber - previousLineNum < 8,
                inProgress: false,
            };

            if (lineNumber === +selectedId || comment._id === selectedId) {
                line.startMinized = false;
            }

            line.comments.push(comment);
            lineNumberMap.set(lineNumber, line);
            previousLineNum = lineNumber;
        });

        const inProgressComment = this.state.inProgressComment;
        if (inProgressComment) {
            const line = lineNumberMap.get(inProgressComment.lineNumber) || {
                comments: [],
                startMinized: false,
                inProgress: true,
            };
            line.comments.push({
                __typename: 'Comment',
                _id: '-1',
                text: inProgressComment.selectedText || '',
                lineNumber: inProgressComment.lineNumber,
                selectedText: inProgressComment.selectedText,
                createdAt: null,
                updatedAt: null,
                author: inProgressComment.author,
            });
            line.inProgress = true;
            line.startMinized = false;
            lineNumberMap.set(inProgressComment.lineNumber, line);
        }

        // const { hash } = window.location; // definitely make the linked comment expando
        // const elementId = hash.replace('#', '');
        // // console.log('')
        // if (elementId) {
        //     const parts = elementId.split('-');
        //     const expandedLine = parts[parts.length - 1];
        //     const commentContainer = lineNumberMap.get(+expandedLine);
        //     if (commentContainer) {
        //         commentContainer.startMinized = false;
        //     }
        // }

        // todo 1
        // if there is a comment on the same line,
        // or just a few lines above comment
        // start the comment in a minimized state

        // todo 2
        // if addnewcomment button clicked,
        // minimize nearby comments

        return lineNumberMap;
    };

    // track the refs for each line in the document
    // these can then be used to find the exact positioning of each line
    // private lineRefs: HTMLDivElement[] = []; // todo to be state or not?
    private setLineRef = (el: HTMLDivElement) => {
        if (!el || !el.dataset) return;
        const lineNumber = parseInt(el.dataset.index || '');
        const { lineRefs } = this.state;
        lineRefs[lineNumber] = el;
        this.setState({ lineRefs });
    };

    // render the rows of Syntax Highlighted elements
    private renderSyntaxLines = ({
        rows,
        stylesheet,
        useInlineStyles,
    }: {
        rows?: any;
        stylesheet?: any;
        useInlineStyles?: any;
    }): JSX.Element => {
        // const createElement = require('react-syntax-highlighter/dist/create-element').default; // todo add to node_modules\@types\react-syntax-highlighter\index.d.t

        // using the index as a key should be okay in this case, we are never insertering or deleting elements
        return rows.map((node: any, i: number) => (
            <div key={i} data-index={i} onClick={this.handleLineClicked} ref={this.setLineRef}>
                {/* todo!!! don't know about passing this state down here... is it causing a re-render for every line? */}
                {/* <SubmitComment
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
        })} */}
                <SyntaxLine lineNumber={i} handleCommentAdd={this.handleCommentAdd}>
                    {createElement({
                        key: `code-segement${i}`,
                        node,
                        stylesheet,
                        useInlineStyles,
                    })}
                </SyntaxLine>
            </div>
        ));
    };

    private handleLineClicked = (event: React.SyntheticEvent<EventTarget>) => {
        // todo if no selection also allow adding comment?
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
        console.log('initial linenumber:' + lineNumber);

        // console.log('mouseup x,y: '+event.pa+','+pageY)

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

    private handleCommentAdd = (lineNumber: number) => {
        const selectedText = this.state.currentlySelected ? this.state.selectedText : '';
        this.setState({
            inProgressComment: {
                lineRef: this.state.lineRefs[lineNumber],
                lineNumber,
                selectedText,
                author: this.props.user,
            },
        });
    };

    private checkTextSelected = () => {
        let text = '';
        const selection = window.getSelection();
        if (selection) {
            text = selection.toString();
        }

        if (this.state.currentlySelected && (!text || !text.length)) {
            this.setState({ currentlySelected: false });
            return false;
        }
        // const range = window.getSelection().getRangeAt(0);
        // const startContainerPosition = range.startContainer.nodeValue
        // const endContainerPosition = parseInt(range.endContainer.parentNode.dataset.position, 10);

        const sel = window.getSelection();
        if (text && sel && sel.rangeCount > 0) {
            // tslint:disable-next-line:no-console
            console.log(`selected text: ${text}`);

            //   const range = sel.getRangeAt(0);
            //   const preCaretRange = range.cloneRange();
            //   preCaretRange.selectNodeContents(document.getElementById(
            //     "doc-body"
            //   ) as Node);

            //                 <div id="sel-text-hover" className="hover-modal">

            const initialElement = sel.getRangeAt(0).startContainer.parentElement;

            const selectedPos = initialElement ? initialElement.getBoundingClientRect() : {};

            // todo find x, y
            // setTimeout(() => {
            //                     this.textHover.current
            // })

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
            this.setState({ currentlySelected: true, selectedText: text, selectedPos });
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
        const text = '';
        const count = 0;
        // for (const comment of this.props.comments) {
        //     text = text.concat(`\n [${count}] line ${comment.data.lineNumber}: ${comment.data.selectedText}`);
        //     count++;
        // }

        return text;
    }

    private handleButtonPress = () => {
        this.setState({ clicksCnt: this.state.clicksCnt + 1 });
    };

    // unfortunately, although event.currentTarget should return the <div> with attached onclick, we can't rely on that
    // to get us the start position of a selection if multiple lines of text are selected
    // find the closest parent element of the current element satisfying the function
    private closestElement = (el: HTMLElement | null, matchFn: (el: HTMLElement) => boolean): HTMLElement | null => {
        if (el) {
            return matchFn(el) ? el : this.closestElement(el.parentElement, matchFn);
        }
        return null;
    };

    // pass the clicked-on selection object and walk up the dom tree to find the line number
    private findFirstLineNumber(sel: Selection): number {
        const initialElement = sel.getRangeAt(0).startContainer.parentElement;

        // todo can just use e.target.closest('.whatever-line-number-class')?
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

export default DocumentBody;
