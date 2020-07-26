import * as React from 'react';
import '../../App.css';
import { FaBeer, FaBook, FaSearch, FaCodeBranch, FaGithub, FaCommentAlt } from 'react-icons/fa';
import { Blob } from '../../generated/graphql';
import 'rbx/index.css';
import {
    Section,
    Title,
    Tag,
    Container,
    Input,
    Button,
    Block,
    Help,
    Control,
    Delete,
    Field,
    Panel,
    Checkbox,
    Icon,
} from 'rbx';

// export interface ICCProps {
//     documentName: string;
//     commentsCount: number;
//     // loadFileHandler: (file: Blob) => void // when a file is selected
// }

// color: Variables["colors"]
// interface IHeaderState {
//     query: string;
//     queryColor: 'primary' | 'link' | 'success' | 'info' | 'warning' | 'danger' | undefined;
//     results: IGithubSearchResults;
// }

// export default class DocumentHeader extends React.Component<ICCProps, IHeaderState> {
//     public state: IHeaderState = {
//         query: '',
//         queryColor: undefined,
//         results: {
//             data: {
//                 total_count: -1,
//                 incomplete_results: false,
//                 items: [],
//             },
//         },
//     };
const DocumentHeader = ({ documentName, commentsCount, cycleTheme }: 
    { documentName: string; commentsCount: number; cycleTheme: () => void; }) => {

        const mgRight = {
            marginRight: "5px"
        }

    return (
        <Section>
            <Container>
                <Title>{documentName}</Title>
                <Title subtitle>
                    <Button color="info" onClick={() => cycleTheme()} style={mgRight} >
                        Change Theme
                    </Button>
                    <Button color="primary" disabled style={mgRight} >Request Public Code Review</Button>
                    <Button badge={commentsCount} badgeColor="primary" badgeOutlined color="primary" outlinedstyle={mgRight}>
                        <FaCommentAlt />
                    </Button>
                </Title>
            </Container>
        </Section>
    );
};
export default DocumentHeader;
