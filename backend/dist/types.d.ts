export type UserRole = 'USER' | 'ADMIN';
export interface UserSession {
    id: number;
    email: string;
    role: UserRole;
}
export interface TodoPayload {
    title: string;
    description?: string;
    dueDate?: string;
    priority?: 'Low' | 'Medium' | 'High';
    completed?: boolean;
    tags?: string[];
}
//# sourceMappingURL=types.d.ts.map