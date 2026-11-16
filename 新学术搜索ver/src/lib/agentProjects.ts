export interface AgentProject {
  id: string;
  title: string;
}

export const defaultAgentProject: AgentProject = { id: 'default', title: 'Default Project' };

const seedAgentProjects: AgentProject[] = [
  { id: '1', title: '长上下文模型位置偏差研究' },
  { id: '2', title: 'RAG Evaluation' },
  { id: '3', title: 'Multimodal Agents' },
  { id: '4', title: 'Old Survey' },
];

export const agentProjectCatalogKey = 'wispaper-project-catalog';
export const agentProjectAdditionsKey = 'wispaper-project-additions';

export function readAgentProjects(): AgentProject[] {
  try {
    const stored = JSON.parse(window.localStorage.getItem(agentProjectCatalogKey) || 'null');
    const additions = JSON.parse(window.localStorage.getItem(agentProjectAdditionsKey) || '[]');
    const base = Array.isArray(stored) ? stored : seedAgentProjects;
    const projects = [...(Array.isArray(additions) ? additions : []), ...base]
      .filter((item): item is AgentProject => item && (typeof item.id === 'string' || typeof item.id === 'number') && typeof item.title === 'string')
      .map((item) => ({ id: String(item.id), title: item.title }))
      .filter((item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index);
    return [defaultAgentProject, ...projects];
  } catch { /* prototype storage */ }
  return [defaultAgentProject, ...seedAgentProjects];
}
