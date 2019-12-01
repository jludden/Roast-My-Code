import React, { useState, useCallback } from 'react';
// import { createElement } from 'react-syntax-highlighter';
// import * as rsh from 'react-syntax-highlighter';
import useHover from 'react-use/lib/useHover';
import { Button, Icon } from 'rbx';
import { FaPlusCircle, FaPlus, FaPlusSquare, FaRegPlusSquare, FaGooglePlus, FaSearchPlus } from 'react-icons/fa';
import RoastComment from './RoastComment';
import { SubmitCommentResponse } from './CommentableCodePage/CommentableCode';
import SubmitComment from './SubmitCommentForm';

// todo delete this whole thing

// interface IRenderProps {
//     rows: any,
//     stylesheet: any,
//     useInlineStyles: any
// }

// export const LineRenderer: React.FunctionComponent<IRenderProps> = ({ rows, stylesheet, useInlineStyles }): JSX.Element => {
//   const createElement = require('react-syntax-highlighter/dist/create-element').default; // todo add to node_modules\@types\react-syntax-highlighter\index.d.t

//   return rows.map((node: any, i: number) => (
//     <div key={i}>
//       <SubmitComment
//       isCurrentlySelected={false}
//        comment={new RoastComment({data: {lineNumber: i}})}
//         onSubmitComment={submitCommentHandler}
//         selectedText=""
//       />
//       {createElement({
//           key: `code-segement${i}`,
//           node,
//           stylesheet,
//           useInlineStyles,
//         })}
//     </div>
//   ));
// }

// export async function submitCommentHandler(comment: RoastComment): Promise<SubmitCommentResponse> {
//   return SubmitCommentResponse.Success;
// }

// export default function myRenderer({ rows, stylesheet, useInlineStyles }: {rows?:any, stylesheet?:any, useInlineStyles?:any}):JSX.Element {
//     const createElement = require('react-syntax-highlighter/dist/create-element').default; // todo add to node_modules\@types\react-syntax-highlighter\index.d.t

//     // using the index as a key should be okay in this case, we are never insertering or deleting elements
//     return rows.map((node: any, i: number) => (
//       <div key={i}>
//         <SubmitComment isCurrentlySelected={false} comment={new Comment(1, 2)} onSubmitComment={submitCommentHandler}/>
//         {createElement({
//             key: `code-segement${i}`,
//             node,
//             stylesheet,
//             useInlineStyles,
//           })}
//       </div>
//     ));
//   }

// function rowRenderer({ rows, stylesheet, useInlineStyles }, { index, key, style }) {
//   return createElement({
//       node: rows[index],
//       stylesheet,
//       style,
//       useInlineStyles,
//       key
//   });
// }

// export default function virtualizedRenderer({ overscanRowCount = 10, rowHeight = 15 } = {}) {
//   return ({ rows, stylesheet, useInlineStyles }) => (
//     <div style={{height: "100%"}}>
//       <AutoSizer>
//         {({ height, width }) => (
//           <List
//             height={height}
//             width={width}
//             rowHeight={rowHeight}
//             rowRenderer={rowRenderer.bind(null, { rows, stylesheet, useInlineStyles })}
//             rowCount={rows.length}
//             overscanRowCount={overscanRowCount}
//           />
//         )}
//       </AutoSizer>
//     </div>
//   )
// }

// display an add button when hovering line of code
// todo debounce hover
// DONE float add button to the end of the line
//  same as DocumentCommentsView
// todo handle window resizing - the measured offset width will be out of date
//  react-use window size hook?
interface IAppProps {
    lineNumber: number;
    handleCommentAdd: (lineNumber: number) => void;
}

const SyntaxLine: React.FunctionComponent<IAppProps> = props => {
    const [styles, setStyles] = useState();
    const measuredRef = useCallback(node => {
        if (node !== null) {
            const styles: React.CSSProperties = {
                position: 'absolute',
                left: `${node.offsetWidth}px`, // node.getBoundingClientRect();
            };

            setStyles(styles);
        }
    }, []);

    const element = (hovered: boolean) => (
        <div>
            {hovered && (
                <Button.Group style={styles} align="right">
                    <Button
                        size="small"
                        rounded
                        onClick={() => props.handleCommentAdd(props.lineNumber)}
                        tooltip="Add a comment"
                    >
                        <Icon size="small">
                            <FaPlus />
                        </Icon>
                    </Button>
                </Button.Group>
            )}
            <div ref={measuredRef}>{props.children}</div>
        </div>
    );

    const [hoverable, hovered] = useHover(element);
    return <div>{hoverable}</div>;
};

export default SyntaxLine;

// export interface ISyntaxLineProps {
// }

// export default class SyntaxLine extends React.Component<ISyntaxLineProps, any> {
//   constructor(props: ISyntaxLineProps) {
//     super(props);

//   }

//   public render() {
//     const element = (hovered: boolean) =>
//     <div>
//         {hovered &&
//         <Button.Group className="float-right" align="right">
//           <Button size="small" rounded onClick={() => this.props.handleCommentAdd(this.props.lineNumber)}>
//             <Icon size="small">
//               <FaPlus />
//             </Icon>
//           </Button>
//           </Button.Group>}
//           {this.props.children}
//     </div>;

//   const [hoverable, hovered] = useHover(element);

//     return (
//       <div>
//        {hoverable}
//       </div>
//     );
//   }
// }
