import { addProjectAgentPaper, projectPaperKey, readProjectAgentPapers } from './agentPaperCollections';

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

export function updateAgentProject(id: string, title: string | null): void {
  if (id === defaultAgentProject.id) return;
  try {
    const projects = readAgentProjects().slice(1);
    const next = title === null ? projects.filter((project) => project.id !== id) : projects.map((project) => project.id === id ? { ...project, title } : project);
    window.localStorage.setItem(agentProjectCatalogKey, JSON.stringify(next));
    for (const key of [agentProjectAdditionsKey, 'wispaper-projects']) {
      const saved = JSON.parse(window.localStorage.getItem(key) || 'null');
      if (!Array.isArray(saved)) continue;
      const changed = title === null ? saved.filter((project) => String(project.id) !== id) : saved.map((project) => String(project.id) === id ? { ...project, title } : project);
      window.localStorage.setItem(key, JSON.stringify(changed));
    }
    if (title === null) {
      readProjectAgentPapers(id).forEach((paper) => addProjectAgentPaper(defaultAgentProject.id, paper));
      window.localStorage.removeItem(projectPaperKey(id));
      Object.keys(window.localStorage).filter((key) => key.startsWith('wispaper-agent-session:')).forEach((key) => {
        try {
          const session = JSON.parse(window.localStorage.getItem(key) || 'null');
          if (String(session?.projectId) === id) {
            window.localStorage.setItem(key, JSON.stringify({ ...session, projectId: defaultAgentProject.id, updatedAt: Date.now() }));
            window.dispatchEvent(new CustomEvent('wispaper:agent-session-changed', { detail: { id: key.slice('wispaper-agent-session:'.length), projectId: defaultAgentProject.id } }));
          }
        } catch { /* ignore malformed mock session */ }
      });
      window.dispatchEvent(new Event('wispaper:agent-history-updated'));
    }
    window.dispatchEvent(new Event('wispaper:projects-updated'));
  } catch { /* prototype storage */ }
}
