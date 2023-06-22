import { useState, useEffect } from 'react';

export type Sections = {
    idea: string;
    'Problem definition': string;
    'Metrics and goals': string;
    'Target audience/personas': string;
    'Constraints': string;
    'Solution overview': string;
};

const useFormattedText = (text: string | null) => {
    const [formattedText, setFormattedText] = useState<Sections | null>(null);

    useEffect(() => {

        if (text === null) return;

        const headers = ['Problem definition', 'Metrics and goals', 'Target audience/personas', 'Constraints', 'Solution overview'];
        const sections: Partial<Sections> = {};

        let currentHeader: keyof Sections = 'idea';
        let currentContent = '';
        text.split('\n').forEach(line => {
            if (headers.includes(line.trim())) {
                if (currentContent) {
                    sections[currentHeader] = currentContent.trim();
                }
                currentHeader = line.trim() as keyof Sections;
                currentContent = '';
            } else if (line.trim() !== '') {
                currentContent += line + '\n';
            }
        });
        sections[currentHeader] = currentContent.trim(); // Save the last section

        setFormattedText(sections as Sections);
    }, [text]);

    return formattedText;
};

export default useFormattedText;
