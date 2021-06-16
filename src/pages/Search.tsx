import React from 'react';
import '../App.css';
import { Container } from 'rbx';
import { Redirect } from 'react-router-dom';
import { Repository, Scalars } from '../generated/graphql';
import RepoSearchContainer from '../components/RepoSearch/RepoSearchContainer';
import './Search.css';

export interface IHomeProps {
    bar: string;
    foo: number;
    children: React.ReactElement;
}

export const RecentlyUpdated = () => {
    return <div>Add Recently Updated Repositories...</div>;
};

export const Search = (props: IHomeProps) => {
    const [shouldRedirect, setShouldRedirect] = React.useState('');

    // const styles: React.CSSProperties = {
    //   grid-column: "absolute",
    //   left: `${node.offsetWidth}px`  // node.getBoundingClientRect();
    // }

    return (
        <Container>
            {shouldRedirect.length > 0 && <Redirect to={`/repo${shouldRedirect}`} push />}

            <RepoSearchContainer
                loadRepoHandler={(path: Scalars["URI"]) => setShouldRedirect(path)}
                loadRecommendedRepo={() => setShouldRedirect('/jludden/ReefLifeSurvey---Species-Explorer')}
            />
            {props.children && React.cloneElement(props.children)}
        </Container>
    );
};
export default Search;
