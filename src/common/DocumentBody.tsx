import * as React from "react";
// import  '../../node_modules/color-themes-for-google-code-prettify/dist/themes/github.min.css'
import '../App.css';
// import '../google-code-prettify/prettify';

// import '../prettifyTypes';
// import * as prettify from './google-code-prettify/prettify';

// import * as prettify from '../google-code-prettify/prettify.js';

import * as prettify from 'code-prettify'
import SyntaxHighlighter from 'react-syntax-highlighter'

// import IGithubData from './CommentableCode';
// import IGithubRepo from './CommentableCode';

export interface IGithubRepo {
    name: string,
    content: string
}

interface IDbResponse {
    data: string,
    clicksCnt: number
}

// interface IPrettifyJS {
//     prettyPrint(): void
// }

// declare global {
//     interface IWindow {
//       prettyprint(): void
//     }
// }  

export default class DocumentBody extends React.Component<IGithubRepo, IDbResponse>
{      
    public state : IDbResponse = {
        clicksCnt: 0,
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
                <h2> react-syntax-highlighter</h2>
                <SyntaxHighlighter language="kotlin" className="left-align">{decoded}</SyntaxHighlighter>
                <h2> code-prettifier </h2>
                <pre className="prettyprint linenums">
                    {decoded}
                </pre>
                <pre className="prettyprint">
                    {decoded}
                </pre>
            </div>
        );
    }
      
    public onMouseUp = (event: React.SyntheticEvent<EventTarget>) => {
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
    }

    public onDoubleClick = (event: React.SyntheticEvent<EventTarget>) => {
        this.setState({clicksCnt : this.state.clicksCnt + 1});
    }

    private handleButtonPress = () => {
        this.setState({clicksCnt : this.state.clicksCnt + 1});
      };

    // todo customize CSS or use theme
    private runCodePrettify() {
        // const prettify = require('../google-code-prettify/run_prettify') as IPrettifyJS;
        // prettify.PR.prettyPrint();
        prettify.prettyPrint();
        // print();

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