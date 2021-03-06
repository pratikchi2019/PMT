export interface NodeData {
    IDX?: number;
    PRM?: number,
    projectName?: string,
    issueType?: string,
    priority?: string,
    status?: string,
    assignee?: string,
    reporter?: string,
    description?: string,
    attachments?: Array<File>,
    startDate?: string,
    estimatedHours?: string,
    parentTaskLink?: string,
    comments?: string,
    history?: string,
    subTasks?: string,
    projectManager?: string,
    health?: string,
    region?: string,
    goLive?: string,
    checkList?: string,
    progress?: number
}