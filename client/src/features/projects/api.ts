import { api } from '../../lib/api';
import type { Project } from './types';
export async function fetchProjects(): Promise<Project[]> {
const { data } = await api.get<{ data: Project[] }>('/projects');
return data.data;
}