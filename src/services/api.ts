import mondaySdk from "monday-sdk-js";

const API_URL = "https://api.monday.com/v2";
const API_HEADERS = {
    'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.MONDAY_API_KEY}`
};

const monday = mondaySdk();
export const fetchDocumentData = async (query: string) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST', headers: API_HEADERS, body: JSON.stringify({query})
        });

        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const createFolder = async (folderName: string, workspaceId: number): Promise<number | null> => {
    try {
        const query = `mutation {
            create_folder (name: "${folderName}", workspace_id: ${workspaceId}) {
                id
            }
        }`;

        const response = await monday.api(query);
        // @ts-ignore
        return response?.data?.create_folder?.id ?? null;

    } catch (error) {
        console.error(error);
        return null;
    }
}

export const createDoc = async (docName: string, folderId: number): Promise<number | null> => {
    try {
        const query = `mutation {
             create_board(board_name: "${docName}", board_kind: public, template_id: 1216234398, folder_id: ${folderId}) {
                id
            }
        }`;

        const response = await monday.api(query);
        // @ts-ignore
        return response?.data?.create_board?.id ?? null;


    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getDocId = async (objectId: number): Promise<number | null> => {
    try {
        const query = `query{
            docs(object_ids:${objectId}){
            id
            }}`;

        const response = await monday.api(query);
        console.log('response: ', response.data);
        // @ts-ignore
        console.log('object id: ', response?.data?.docs[0].id)
        // @ts-ignore
        return response?.data?.docs[0].id ?? null;


    } catch (error) {
        console.error(error);
        return null;
    }
}

export const addBlocksToDoc = async (blocksData: { title: string, content: string }, docId: number): Promise<void> => {
    try {
        const titleContent = JSON.stringify({
            "alignment": "left",
            "direction": "ltr",
            "deltaFormat": [{"insert": blocksData.title}]
        });
        const titleQuery = `mutation {
            create_doc_block(
                doc_id: ${docId}, 
                content: ${JSON.stringify(titleContent)}, 
                type: small_title
            ) { id }
        }`;

/*        const titleResponse = await monday.api(titleQuery);
        console.log('Title block created: ', titleResponse.data);*/

        const contentContent = JSON.stringify({
            "alignment": "left",
            "direction": "ltr",
            "deltaFormat": [{"insert": blocksData.content}]
        });
        const contentQuery = `mutation {
            create_doc_block(
                doc_id: ${docId}, 
                content: ${JSON.stringify(contentContent)}, 
                type: normal_text
            ) { id }
        }`;

        const contentResponse = await monday.api(contentQuery);
        console.log('Content block created: ', contentResponse.data);

    } catch (error) {
        console.error(error);
    }
};


/*
export const addBlocksToDoc = async (blocksData: { title: string, content: string }, docId: number): Promise<void> => {
    const blocks = [{
        type: 'small title', content: {
            deltaFormat: [{
                insert: blocksData.title
            }]
        }, docId: docId,
    }, {
        type: 'normal text', content: {
            deltaFormat: [{
                insert: blocksData.content
            }]
        }, docId: docId,
    }];

    try {
        console.log("Adding blocks to doc...");
        console.log('docId: ', docId);
        await monday.execute("addMultiBlocks", {blocks, docId});
    } catch (err) {
        console.error(err);
    }
};
*/
