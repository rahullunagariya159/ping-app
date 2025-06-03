export const pingURL = async (url: string): Promise<'P' | 'F'> => {
    try {
        const response = await fetch(url, { mode: 'no-cors' });
        return response ? 'P' : 'F';
    } catch {
        return 'F';
    }
};