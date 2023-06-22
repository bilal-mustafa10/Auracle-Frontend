export type ProjectInfo = {
    idea: string,
    problemDefinition: string,
    metricsAndGoals: string,
    targetAudience: string,
    constraints: string,
    solutionOverview: string
}

export function parseProjectDescription(description: string): ProjectInfo {
    const sections = ['project idea', 'problem definition', 'metrics and goals', 'target audience/personas', 'constraints', 'solution overview'];
    const descriptionLowered = description.toLowerCase();
    const projectInfo: ProjectInfo = {
        idea: "",
        problemDefinition: "",
        metricsAndGoals: "",
        targetAudience: "",
        constraints: "",
        solutionOverview: ""
    }

    for(let i = 0; i < sections.length - 1; i++) {
        const start = descriptionLowered.indexOf(sections[i]) + sections[i].length;
        const end = descriptionLowered.indexOf(sections[i + 1]);
        const content = description.substring(start, end).trim();

        projectInfo[sections[i].replace(/ /g, '') as keyof ProjectInfo] = content;
    }

    // handle the last section separately as it extends to the end of the text
    const lastSectionStart = descriptionLowered.indexOf(sections[sections.length - 1]) + sections[sections.length - 1].length;
    projectInfo[sections[sections.length - 1].replace(/ /g, '') as keyof ProjectInfo] = description.substring(lastSectionStart).trim();

    return projectInfo;
}
