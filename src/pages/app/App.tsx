import React, {useEffect, useState} from 'react';
import mondaySdk from 'monday-sdk-js';
import {getSoftwarePlan, PlanData} from "@/services/backend-api-service";
import {addBlocksToDoc} from "@/services/api";

const monday = mondaySdk();

const App: React.FC = () => {
    const [projectDescription, setProjectDescription] = useState<string | null>(null);
    const [softwarePlan, setSoftwarePlan] = useState<PlanData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



    /*const getDocumentData = useCallback(async () => {
        const query = "query { docs (ids: 398114, limit: 1) { id object_id settings created_by { id name }}}";
        const data = await fetchDocumentData(query);
        console.log(data);
    }, []);*/

    /*useEffect(() => {
        getDocumentData();
    }, [getDocumentData]);*/

    useEffect(() => {
        monday.listen("context", (res: any) => {
            console.log(res.data.input);
            //setProjectDescription(parseProjectDescription(res.data.input));
            setProjectDescription(res.data.input);
            // setDocId(res.data.docId);
            //setSessionToken(res.data.sessionToken);
        });
    }, []);

    useEffect(() => {
        if (projectDescription) {
            const fetchSoftwarePlan = async () => {
                try {
                    setLoading(true);
                    const softwarePlanData = await getSoftwarePlan(projectDescription);
                    setSoftwarePlan(softwarePlanData.answer);
                    setLoading(false);

                    const blocksData = [
                        { type: 'normal text', title: 'Context', content: softwarePlanData.answer.context },
                        { type: 'normal text', title: 'Project Plan', content: softwarePlanData.answer.project_plan },
                        { type: 'normal text', title: 'Requirements USPs', content: softwarePlanData.answer.requirements_USPs },
                        { type: 'normal text', title: 'Requirements Details', content: softwarePlanData.answer.requirements_details },
                        { type: 'normal text', title: 'Risk Assessment', content: softwarePlanData.answer.risk_assessment }
                    ];

                    await addBlocksToDoc(blocksData);
                } catch (err: any) {
                    setLoading(false);
                    setError(err.message);
                }
            };

            fetchSoftwarePlan();
        }
    }, [projectDescription]);


    return (
        <div className="main">
            {loading ? (
                <div>Loading...</div> // replace this with your spinner
            ) : error ? (
                <div>Error: {error}</div>
            ) : softwarePlan ? (
                <div>
                    <h1>{softwarePlan.context}</h1>
                    <p>{softwarePlan.project_plan}</p>
                    <p>{softwarePlan.requirements_USPs}</p>
                    <p>{softwarePlan.requirements_details}</p>
                    <p>{softwarePlan.risk_assessment}</p>
                </div>
            ) : null}
        </div>
    );
};

export default App;
