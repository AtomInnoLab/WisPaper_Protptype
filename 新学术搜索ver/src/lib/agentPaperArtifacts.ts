import { AgentPaper, paperIdentity } from './agentPaperCollections';

export type AgentArtifactKind = 'markdown' | 'pdf' | 'word' | 'bib';
export interface AgentArtifact {
  id: string;
  name: string;
  kind: AgentArtifactKind;
  content: string;
}

interface CitationReference {
  key: string;
  title?: string;
  doi?: string;
  surname?: string;
  year?: number;
}

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]/g, '');

export function extractArtifactCitations(artifact: AgentArtifact): CitationReference[] {
  const references: CitationReference[] = [];
  if (artifact.kind === 'bib') {
    const entries = artifact.content.matchAll(/@\w+\s*\{\s*([^,\s]+),([\s\S]*?)(?=\n\s*@\w+\s*\{|$)/g);
    for (const entry of entries) {
      const body = entry[2];
      references.push({ key: entry[1], title: body.match(/\btitle\s*=\s*[{"]([^}"]+)/i)?.[1]?.trim(), doi: body.match(/\bdoi\s*=\s*[{"]([^}"]+)/i)?.[1]?.trim() });
    }
  } else {
    for (const bracket of artifact.content.matchAll(/\[([^\]]*@[\w.\-:/]+[^\]]*)\]/g)) {
      for (const cite of bracket[1].matchAll(/@([\w.\-:/]+)/g)) references.push({ key: cite[1] });
    }
    for (const cite of artifact.content.matchAll(/\\cite\w*\s*\{([^}]+)\}/g)) {
      cite[1].split(',').map((key) => key.trim()).filter(Boolean).forEach((key) => references.push({ key }));
    }
    for (const cite of artifact.content.matchAll(/\(([A-Z][A-Za-z-]+)\s+et al\.,?\s*(20\d{2})\)/g)) {
      references.push({ key: `${cite[1]} et al., ${cite[2]}`, surname: cite[1], year: Number(cite[2]) });
    }
  }
  return references.filter((reference, index) => references.findIndex((item) => normalize(item.key) === normalize(reference.key)) === index);
}

export function analyzeArtifactCitations(artifact: AgentArtifact, papers: AgentPaper[]) {
  const matched: Array<{ reference: CitationReference; paper: AgentPaper }> = [];
  const unmatched: CitationReference[] = [];
  for (const reference of extractArtifactCitations(artifact)) {
    const paper = papers.find((item) => {
      const keys = [item.id, item.title, item.doi ?? ''].map(normalize).filter(Boolean);
      if ([reference.key, reference.title ?? '', reference.doi ?? ''].map(normalize).some((key) => key && keys.includes(key))) return true;
      return Boolean(reference.surname && reference.year && item.year === reference.year && normalize(item.authors?.split(/[\s,]/)[0] ?? '') === normalize(reference.surname));
    });
    if (paper) matched.push({ reference, paper });
    else unmatched.push(reference);
  }
  return { matched, unmatched };
}

export function artifactsForPaper(paper: AgentPaper, artifacts: AgentArtifact[], papers: AgentPaper[]) {
  return artifacts.filter((artifact) => analyzeArtifactCitations(artifact, papers).matched.some((item) => paperIdentity(item.paper) === paperIdentity(paper)));
}

export function mockAgentArtifact(kind: AgentArtifactKind): AgentArtifact {
  const examples: Record<AgentArtifactKind, { name: string; content: string }> = {
    markdown: { name: '长期记忆文献综述.md', content: '# 长期记忆文献综述\n\nMemoryBank 提供长期记忆库方案 [@memorybank]；Generative Agents 展示记忆与反思机制 [@generative-agents]。\n\n待核验的主张引用了 [@fabricated-memory-2025]。' },
    pdf: { name: '长期记忆研究报告.pdf', content: 'PDF 提取文本：长期记忆机制可参考 (Zhong et al., 2024)。另一处引用 (Smith et al., 2025) 尚需核验。' },
    word: { name: '长期记忆实验记录.docx', content: 'Word 提取文本：行为模拟参考 (Park et al., 2023)；实验扩展引用 (Chen et al., 2026) 待核验。' },
    bib: { name: '长期记忆参考文献.bib', content: '@article{memorybank2024,\n  title={MemoryBank: Enhancing Large Language Models with Long-Term Memory},\n  author={Zhong et al.},\n  year={2024}\n}\n@article{unknown2025,\n  title={Imaginary Memory Benchmark},\n  author={Smith et al.},\n  year={2025}\n}' },
  };
  return { id: `${kind}-${Date.now()}`, kind, ...examples[kind] };
}
