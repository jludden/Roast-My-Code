import * as React from 'react';

function getCurrentLocation() {
    return {
        pathname: window.location.pathname,
        search: window.location.search,
    };
}

export const useWindowPath = () => {
    const [{ pathname, search }, setPath] = React.useState(getCurrentLocation());

    const listenToPopstate = () => {
        setPath(getCurrentLocation());
    };
    React.useEffect(() => {
        window.addEventListener('popstate', listenToPopstate);
        return () => {
            window.removeEventListener('popstate', listenToPopstate);
        };
    }, []);
    return { pathname, search };
};
