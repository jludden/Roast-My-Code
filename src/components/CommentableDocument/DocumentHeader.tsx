import * as React from 'react';
import '../../App.css';
import { FaBeer, FaBook, FaSearch, FaCodeBranch, FaGithub, FaCommentAlt } from 'react-icons/fa';
import API, { IGithubSearchResults } from '../../api/API';
import { useQueryParam, NumberParam, StringParam } from 'use-query-params';

// import RepoSearch from "./RepoSearch/RepoSearch";
// import RepoExplorer from "./RepoSearch/RepoExplorer";
import { Blob } from '../../generated/graphql';
// import ICCProps from './CommentableCode';
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

export interface ICCProps {
    documentName: string;
    commentsCount: number;
    // loadFileHandler: (file: Blob) => void // when a file is selected
}

// color: Variables["colors"]
interface IHeaderState {
    query: string;
    queryColor: 'primary' | 'link' | 'success' | 'info' | 'warning' | 'danger' | undefined;
    results: IGithubSearchResults;
}

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
const DocumentHeader = ({ documentName, commentsCount }: { documentName: string; commentsCount: number }) => {
    // const [fileName, setUrl] = useQueryParam('file', StringParam);

    return (
        <Section>
            <Container>
                <Title>{documentName}</Title>
                <Title subtitle>
                    <FaGithub /> number of comments: {commentsCount}
                    <Button badge={commentsCount} badgeColor="danger" badgeOutlined color="danger" outlined>
                        <FaCommentAlt />
                    </Button>
                </Title>
                <Button color="primary">Request Public Code Review</Button>
            </Container>
        </Section>
    );
};
export default DocumentHeader;
