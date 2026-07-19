export interface TeacherClassSource {
    id: string;
    name: string;
    status: "Pending" | "Processing" | "Completed" | "Failed";
    sourceType: string;
    createdAt: string;
    processingJobsIds: string[];
}
