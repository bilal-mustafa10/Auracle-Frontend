import mondaySdk from "monday-sdk-js";
import {PlanData} from "@/services/backend-api-service";

const API_URL = "https://api.monday.com/v2";
const API_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.MONDAY_API_KEY}`
};

const monday = mondaySdk();


export const fetchDocumentData = async (query: string) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: API_HEADERS,
            body: JSON.stringify({ query })
        });

        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const addBlocksToDoc = async (blocksData: Array<{ type: string, title: string, content: string }>) => {
    if (!Array.isArray(blocksData)) {
        console.error('blocksData is not an array:', blocksData);
        return;
    }

    const blocks = blocksData.map(block => {
        const blockContent = {
            deltaFormat: [
                {
                    insert: block.title,
                    attributes: {
                        header: 1
                    }
                },
                {
                    insert: "\n"
                },
                {
                    insert: block.content
                }
            ]
        };

        return {
            type: block.type,
            content: blockContent
        };
    });

    try {
        console.log("Adding blocks to doc...");
        await monday.execute("addMultiBlocks", { blocks });
    }
    catch (err) {
        console.error(err);
    }
};


