import React, { useEffect, useState, useCallback } from 'react';
import mondaySdk from 'monday-sdk-js';
import {getSoftwarePlan, PlanData, postRe} from "@/services/backend-api-service";
import {addBlocksToDoc, createDoc, createFolder, getDocId} from "@/services/api";
import { Checkbox, Loader, Button } from "monday-ui-react-core";
import useFormattedText, { Sections } from "@/helpers/parse-description";
import "./App.scss";

const monday = mondaySdk();

const App: React.FC = () => {
    const [input, setInput] = useState<string | null>(null);
    const projectDescription = useFormattedText(input);
    const [softwarePlan, setSoftwarePlan] = useState<PlanData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checkedItems, setCheckedItems] = useState<{[key: string]: boolean}>({});
    const [workspaceId, setWorkspaceId] = useState<number | null>(null);

    const fetchSoftwarePlan = useCallback(async () => {
        if (projectDescription) {
            try {
                setLoading(true);
                const softwarePlanData = await getSoftwarePlan(projectDescription);
                setSoftwarePlan(softwarePlanData.answer);
                setLoading(false);
            } catch (err: any) {
                setLoading(false);
                setError(err.message);
            }
        }
    }, [projectDescription]);

    useEffect(() => {
        monday.listen("context", (res: any) => {
            const inputData = res.data.input;
            if (inputData) {
                setInput(inputData);
                console.log('input', inputData);
                console.log('workspace_id', res.data.workspaceId);
                setWorkspaceId(res.data.workspaceId)
            }
        });
    }, []);

    useEffect(() => {
        if (projectDescription && softwarePlan === null) {
            console.log('fetching software plan')
            fetchSoftwarePlan();
        }
    }, [projectDescription, fetchSoftwarePlan]);

    const handleInsertClick = async () => {
        const blocksData = Object.entries(checkedItems).reduce((blocks, [key, isChecked]) => {
            if (isChecked) {
                console.log(key, softwarePlan![key as keyof PlanData]);
                blocks.push({
                    title: key,
                    content: softwarePlan![key as keyof PlanData]
                });
            }
            return blocks;
        }, [] as {title: string, content: string}[]);

        const idea= projectDescription?.idea

        const folderId = await createFolder(`${idea} Software Plan`, workspaceId as number);

        if (folderId === null) {
            setError('Error creating folder')
            return;
        }

        console.log('blocksData', blocksData);

        blocksData.map(async (block) => {
            const docId = await createDoc(block.title, folderId)
            if (docId === null) {
                setError('Error creating doc')
                return;
            }

            const objectId = await getDocId(docId)

            if (objectId === null) {
                setError('Error getting object id')
                return;
            }

            await addBlocksToDoc(block, objectId)
        })

        return;

    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedItems({...checkedItems, [event.target.name]: event.target.checked});
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="loading-container">
                    <Loader size={Loader.sizes.XS} className="loading-spinner" />
                    <h4 className="loading-text">Generating software plan...</h4>
                </div>
            );
        }

        if (error) {
            return <div className="error-message">Error: {error}</div>;
        }

        if (softwarePlan) {
            return (
                <div className="software-plan">
                    {Object.keys(softwarePlan).map(item => (
                        <div className="checkbox-container" key={item}>
                            <label className="checkbox-label">
                                {item}
                                <Checkbox
                                    className="checkbox-item"
                                    name={item}
                                    defaultChecked={checkedItems[item]}
                                    onChange={handleCheckboxChange}
                                />
                            </label>
                        </div>
                    ))}
                    <Button className="insert-button" onClick={handleInsertClick}>Generate a document folder</Button>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="main">
            <h2 className="header">Software Plan</h2>
            {renderContent()}
        </div>
    );
};

export default App;
