import { z } from "zod";

export const CreateCourseModulSchema = z.object({
    title: z.string(),
    description : z.string().max(10000, "描述過長"),
    TeacherId : z.string(),
    teaching_materials:z.string().optional(),
    originalFileName: z.string().optional(),
}) 