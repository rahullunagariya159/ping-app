export type PingTest = {
    id: string;
    url: string;
    interval: number;
    tags: string[];
    results: ('P' | 'F')[];
    lastExecuted: string;
    isRunning: boolean;
};