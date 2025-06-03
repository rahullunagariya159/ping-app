import React, { createContext, useState, useEffect } from 'react';
import { PingTest } from '../utils/types';

export const PingContext = createContext<any>(null);

export const PingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const savedTests = localStorage.getItem('pingTests');
    const [tests, setTests] = useState<PingTest[]>(savedTests ? JSON.parse(savedTests) : []);

    // useEffect(() => {
    //     const saved = localStorage.getItem('pingTests');
    //     if (saved) setTests(JSON.parse(saved));
    // }, []);

    useEffect(() => {
        localStorage.setItem('pingTests', JSON.stringify(tests));
    }, [tests]);

    return <PingContext.Provider value={{ tests, setTests }}>{children}</PingContext.Provider>;
};
