// import * as React from "react";
// import { createElement } from 'react-syntax-highlighter';
// import * as rsh from 'react-syntax-highlighter';
// 

// interface IRenderProps {
//     rows: any,
//     stylesheet: any,
//     useInlineStyles: any
// }

export default function myRenderer({ rows, stylesheet, useInlineStyles }: {rows?:any, stylesheet?:any, useInlineStyles?:any}) {
    const createElement = require('react-syntax-highlighter/dist/create-element').default; // todo add to node_modules\@types\react-syntax-highlighter\index.d.ts

    return rows.map((node: any, i: number) =>
    createElement({
        key: `code-segement${i}`,
        node,
        stylesheet,
        useInlineStyles,
      })
    );
  }

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