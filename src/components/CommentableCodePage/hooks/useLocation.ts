import React, { useState, useEffect } from 'react';

function getCurrentLocation() {
    return {
        pathname: window.location.pathname,
        search: window.location.search,
    };
}

/**
 * @type {Array<() => void>}
 */
const listeners: (() => void)[] = [];

/**
 * Notifies all location listeners. Can be used if the history state has been manipulated
 * in by another module. Effectifely, all components using the 'useLocation' hook will
 * update.
 */
export function notify() {
    listeners.forEach(listener => listener());
}

export function useLocation() {
    const [{ pathname, search }, setLocation] = useState(getCurrentLocation());
    function handleChange() {
        setLocation(getCurrentLocation());
        // setLocation(e.state.)
    }
    useEffect(() => {
        window.addEventListener('pushstate', handleChange);
        // window.addEventListener('popstate', handleChange);
        window.addEventListener('popstate', handleChange);
        return () => window.removeEventListener('popstate', handleChange);
    }, []);

    useEffect(() => {
        listeners.push(handleChange);
        const listener = listeners.splice(listeners.indexOf(handleChange), 1)[0];
        return listener;
    }, []);

    /**
     * @param {string} url
     */
    function push(url: string) {
        window.history.pushState(null, '', url);
        notify();
    }

    /**
     * @param {string} url
     */
    function replace(url: string) {
        window.history.replaceState(null, '', url);
        notify();
    }

    return {
        push,
        replace,
        pathname,
        search,
    };
}
