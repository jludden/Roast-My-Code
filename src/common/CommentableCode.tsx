import * as React from "react";
import '../App.css';
import axiosGithub from './axios-github';
import ClassHeader from "./ClassHeader";
// import { AxiosPromise } from 'axios';

// todo type instead of interface?
export interface ICCProps {
    document: string
}

// export interface ICCState {
//     data: string
// }

export interface IGithubData {
    data: IComment[]
}

export interface IComment {
    id: number,
    body: string,
    postId: number
}

export interface IGithubRepo {
    name: string,
    content: string
}

export default class CommentableCode extends React.Component<ICCProps, IGithubData> {
    public state: IGithubData = {
        data: [
            {
                body: "",
                id: 0,
                postId: 0
            }
        ]
    }

    public async getCode():Promise<IGithubData> {
        return await axiosGithub.get("http://localhost:3001/comments/");
    }

    public async GetGithub():Promise<IGithubData> {
        return await axiosGithub.get("https://api.github.com/repos/jludden/ReefLifeSurvey---Species-Explorer/contents/app/src/main/java/me/jludden/reeflifesurvey/detailed/DetailsActivity.kt")
    }

    public simpleMethod(a:number, b:number) {
        return a*b;
    }

    public async componentDidMount() {
       // axiosGithub.get("http://localhost:3001/comments")
    //    this.getCode().then(resp => this.setState({ data: "my returned data" })); // todo async await
        // .then(resp => this.setState({data: resp[0].body}));

        this.runCodePrettify();
        await this.GetGithub();
        const result = await this.getCode();
        return this.setState(result);
        // return this.getCode().then(resp => this.setState(result)); // todo async await
    }

    public render() {
        const {document} = this.props;
        // const {data} = this.state;

        // const data = (props: { document: React.ReactNode; }) => {
        //     return (
        //         <div>
        //             <h1> AXIOS testing</h1>
        //             <h2> {props.document} </h2>
        //         </div>
        //     )
        // }

        const toPrint = "let a = Math.Max(a, b, c);"
        const toPrintMultiLine = `// This is line 4.
        foo();
        bar();
        baz();
        boo();
        far();
        faz();`


        // can't render a pure function <p>{data}</p> 
        return (
            <div>
            <h1>
               Hello welcome to the Annotateable Code Sample
            </h1>
            <pre className="prettyprint linenums">
                {toPrintMultiLine}
            </pre>
            
            <pre className="prettyprint linenums">
                {this.state.data[0].body}
            </pre>
            {/*
            <pre className="prettyprint linenums">
                {data[0]}
            </pre> */}
            <code className="prettyprint">
                {toPrint}
            </code>
            <data/>
            <ClassHeader document="hello"/>
            <h2>
                {document}
            </h2>            
            <p className="text-xs-right">
                custom class
            </p>
            </div>
        );
    }
    
    private runCodePrettify() {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
    
        script.src = 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    }
}