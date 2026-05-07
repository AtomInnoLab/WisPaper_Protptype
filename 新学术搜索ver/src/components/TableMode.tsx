import React from 'react';
import { Check, Copy, ExternalLink, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface TableData {
  id: string;
  title: string;
  year: string;
  source: string;
  authors?: string;
  citations?: number;
  answer: string;
  isLoading?: boolean;
  type?: 'paper' | 'book' | 'thesis' | 'special' | 'dataset'; // 资源类型
}

interface TableModeProps {
  question: string;
  papers?: TableData[];
}

const mockPapers: TableData[] = [
  {
    id: '1',
    title: 'Attention Is All You Need',
    year: '2017',
    source: 'NeurIPS',
    authors: 'Vaswani et al.',
    citations: 85234,
    answer: 'Core idea is to use self-attention mechanism for sequence modeling, eliminating the need for recurrence and convolutions. The Transformer architecture relies entirely on attention mechanisms to draw global dependencies between input and output.',
    type: 'paper',
  },
  {
    id: '2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    year: '2019',
    source: 'NAACL',
    authors: 'Devlin et al.',
    citations: 62451,
    answer: 'Introduces novel pre-training approach using masked language modeling and next sentence prediction. BERT enables bidirectional context understanding by jointly conditioning on both left and right context in all layers.',
    type: 'paper',
  },
  {
    id: '3',
    title: 'GPT-3: Language Models are Few-Shot Learners',
    year: '2020',
    source: 'NeurIPS',
    authors: 'Brown et al.',
    citations: 41823,
    answer: 'Demonstrates that scaling language models to 175B parameters enables strong few-shot learning without fine-tuning. The model can perform various tasks by providing a few examples in the prompt.',
    type: 'paper',
  },
  {
    id: '4',
    title: 'Chain-of-Thought Prompting Elicits Reasoning',
    year: '2022',
    source: 'NeurIPS',
    authors: 'Wei et al.',
    citations: 3421,
    answer: 'Shows that providing step-by-step reasoning examples significantly improves performance on complex reasoning tasks. The approach enables language models to decompose multi-step problems into intermediate reasoning steps.',
    type: 'paper',
  },
];

// Loading skeleton for a table row
const LoadingRow = () => (
  <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 align-top">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
        <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3"></div>
      </div>
    </td>
    <td className="px-6 py-4 align-top">
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
      </div>
    </td>
  </tr>
);

export function TableMode({ question, papers = mockPapers }: TableModeProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = React.useState(false);
  
  // 获取资源类型标签
  const getResourceTypeLabel = (type?: string) => {
    switch (type) {
      case 'book':
        return t('resource.book');
      case 'thesis':
        return t('resource.thesis');
      case 'special':
        return t('resource.special');
      case 'dataset':
        return t('resource.dataset');
      case 'paper':
      default:
        return t('resource.paper');
    }
  };
  
  // 获取资源类型标签样式
  const getResourceTypeStyle = (type?: string) => {
    const baseStyle = "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0";
    return `${baseStyle} bg-gray-100 text-gray-700 border border-gray-300`;
  };

  const handleCopyTable = async () => {
    const rows = [
      ['Title', 'Year', 'Source', 'Authors', 'Citations', 'Type', question],
      ...papers.map((paper) => [
        paper.title,
        paper.year,
        paper.source,
        paper.authors || '',
        paper.citations ? String(paper.citations) : '',
        getResourceTypeLabel(paper.type),
        paper.answer,
      ]),
    ];
    const tableText = rows.map((row) => row.join('\t')).join('\n');

    try {
      await navigator.clipboard.writeText(tableText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error('Failed to copy table answer', error);
    }
  };

  return (
    <div className="w-full">
      {/* Table Container */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/3">
                文献元数据
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-2/3">
                {question}
              </th>
            </tr>
          </thead>
          <tbody>
            {papers.map((paper) => (
              paper.isLoading ? (
                <LoadingRow key={paper.id} />
              ) : (
                <tr 
                  key={paper.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors group"
                >
                  {/* Paper Metadata Column */}
                  <td className="px-6 py-4 align-top">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                            {paper.title}
                          </h3>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1 ml-6">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Year:</span>
                          <span className="font-medium">{paper.year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Source:</span>
                          <span className="font-medium">{paper.source}</span>
                        </div>
                        {paper.authors && (
                          <div className="flex items-start gap-2">
                            <span className="text-gray-500 flex-shrink-0">Authors:</span>
                            <span className="font-medium">{paper.authors}</span>
                          </div>
                        )}
                        {paper.citations && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 flex-shrink-0">Citations:</span>
                            <span className="font-medium">{paper.citations}</span>
                          </div>
                        )}
                        {paper.type && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 flex-shrink-0">Type:</span>
                            <span className={getResourceTypeStyle(paper.type)}>{getResourceTypeLabel(paper.type)}</span>
                          </div>
                        )}
                      </div>
                      <button className="ml-6 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors opacity-0 group-hover:opacity-100">
                        <ExternalLink className="w-3 h-3" />
                        <span>打开论文</span>
                      </button>
                    </div>
                  </td>

                  {/* Answer Column */}
                  <td className="px-6 py-4 align-top">
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                      {paper.answer}
                    </p>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Info Footer */}
      <div className="mt-3 flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopyTable}
            className="inline-flex items-center gap-1.5 font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? '已复制' : '复制'}</span>
          </button>
          <button className="font-medium text-blue-600 transition-colors hover:text-blue-700">
            导出xlsx
          </button>
        </div>
        <span className="text-gray-500">显示 {papers.length} 篇相关文献</span>
      </div>
    </div>
  );
}
