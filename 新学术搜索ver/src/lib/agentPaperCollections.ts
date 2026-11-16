export interface AgentPaper {
  id: string;
  title: string;
  authors?: string;
  year?: number;
  doi?: string;
  match?: 'Perfect' | 'Partial';
  sources: Array<'deep-search' | 'upload' | 'web'>;
  markdownReady: boolean;
  pdfPath?: string;
  tldr?: string;
  updatedAt?: number;
}

export type PaperScope = 'session' | 'project' | 'library';

export const libraryPaperKey = 'wispaper-agent-library-papers';
export const projectPaperKey = (projectId: string) => `wispaper-agent-project-papers:${projectId}`;
export const agentPaperDirectory = 'papers/';
export const agentPaperIndexPath = `${agentPaperDirectory}index.csv`;

const sampleTldrs: Record<string, string> = {
  memorybank: '使用记忆库增强大语言模型的长期交互记忆能力。',
  'generative-agents': '通过记忆、反思和规划模拟可信的生成式智能体行为。',
  'memory-survey': '梳理基于大语言模型的智能体记忆机制与研究方向。',
};
export const paperTldr = (paper: AgentPaper) => paper.tldr || sampleTldrs[paper.id] || '';

export function paperPdfPath(paper: AgentPaper): string {
  if (paper.pdfPath) return paper.pdfPath;
  if (!paper.markdownReady) return '';
  const name = paper.title.replace(/[\\/:*?"<>|]/g, '_').trim() || paper.id;
  return `${agentPaperDirectory}${name}.pdf`;
}

export function paperMarkdownPath(paper: AgentPaper): string {
  const pdfPath = paperPdfPath(paper);
  return paper.markdownReady && pdfPath ? pdfPath.replace(/\.pdf$/i, '.md') : '';
}

const csvField = (value: string) => `"${value.replace(/"/g, '""')}"`;
export function agentPaperIndexCsv(papers: AgentPaper[]): string {
  return [
    'title,authors,pdf_path,tldr',
    ...papers.map((paper) => [paper.title, paper.authors ?? '', paperPdfPath(paper), paperTldr(paper)].map(csvField).join(',')),
  ].join('\r\n') + '\r\n';
}

const firstProjectPapers: AgentPaper[] = [
  { id: 'project-memorybank', title: 'MemoryBank: Enhancing Large Language Models with Long-Term Memory', authors: 'Zhong et al.', year: 2024, sources: ['deep-search'], markdownReady: true },
  { id: 'project-generative-agents', title: 'Generative Agents: Interactive Simulacra of Human Behavior', authors: 'Park et al.', year: 2023, sources: ['deep-search'], markdownReady: true },
  { id: 'project-memgpt', title: 'MemGPT: Towards LLMs as Operating Systems', authors: 'Packer et al.', year: 2024, sources: ['deep-search'], markdownReady: false },
];

export const paperIdentity = (paper: AgentPaper) => paper.doi?.toLowerCase().trim() || paper.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]/g, '');
export const sortAgentPapers = (papers: AgentPaper[]) => [...papers].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));

export function mergeAgentPapers(current: AgentPaper[], incoming: AgentPaper[]): { papers: AgentPaper[]; duplicates: number; updatedId: string | null } {
  const papers = [...current];
  let duplicates = 0;
  let updatedId: string | null = null;
  const updatedAt = Math.max(Date.now(), ...papers.map((paper) => paper.updatedAt ?? 0)) + 1;
  incoming.forEach((paper) => {
    const index = papers.findIndex((item) => paperIdentity(item) === paperIdentity(paper));
    if (index < 0) { papers.push({ ...paper, updatedAt }); updatedId = paper.id; return; }
    duplicates += 1;
    updatedId = papers[index].id;
    papers[index] = { ...papers[index], ...paper, id: papers[index].id, updatedAt, sources: Array.from(new Set([...papers[index].sources, ...paper.sources])), markdownReady: papers[index].markdownReady || paper.markdownReady, pdfPath: paper.pdfPath || papers[index].pdfPath, tldr: paper.tldr || papers[index].tldr };
  });
  return { papers: sortAgentPapers(papers), duplicates, updatedId };
}

function readPapers(key: string, fallback: AgentPaper[] = []): AgentPaper[] {
  try {
    const stored = JSON.parse(window.localStorage.getItem(key) || 'null');
    return Array.isArray(stored) ? sortAgentPapers(stored.filter((paper) => paper && typeof paper.title === 'string' && Array.isArray(paper.sources))) : fallback;
  } catch { return fallback; }
}

export const readProjectAgentPapers = (projectId: string) => readPapers(projectPaperKey(projectId), projectId === '1' ? firstProjectPapers : []);
export const readLibraryAgentPapers = () => readPapers(libraryPaperKey);

export function addProjectAgentPaper(projectId: string, paper: AgentPaper) {
  const result = mergeAgentPapers(readProjectAgentPapers(projectId), [paper]);
  try { window.localStorage.setItem(projectPaperKey(projectId), JSON.stringify(result.papers)); } catch { /* prototype storage */ }
  window.dispatchEvent(new CustomEvent('wispaper:agent-papers-updated', { detail: { scope: 'project', projectId } }));
  return result;
}

export function addLibraryAgentPaper(paper: AgentPaper) {
  const result = mergeAgentPapers(readLibraryAgentPapers(), [paper]);
  try { window.localStorage.setItem(libraryPaperKey, JSON.stringify(result.papers)); } catch { /* prototype storage */ }
  window.dispatchEvent(new CustomEvent('wispaper:agent-papers-updated', { detail: { scope: 'library' } }));
  return result;
}
