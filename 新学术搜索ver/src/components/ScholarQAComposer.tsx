import React, { useRef, useState } from 'react';
import {
  ArrowUp,
  BookOpen,
  Check,
  ChevronDown,
  FileText,
  Lightbulb,
  Library,
  Plus,
  Search,
  Upload,
  X,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export type QAKnowledgeScope = 'single-paper' | 'library' | 'scholar-search';
export type QAThinkingDepth = 'light' | 'medium' | 'deep';

interface ScholarQAComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  knowledgeScope: QAKnowledgeScope;
  onKnowledgeScopeChange: (scope: QAKnowledgeScope) => void;
  thinkingDepth: QAThinkingDepth;
  onThinkingDepthChange: (depth: QAThinkingDepth) => void;
  compact?: boolean;
}

export function ScholarQAComposer({
  value,
  onChange,
  onSubmit,
  knowledgeScope,
  onKnowledgeScopeChange,
  thinkingDepth,
  onThinkingDepthChange,
  compact = false,
}: ScholarQAComposerProps) {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const [openMenu, setOpenMenu] = useState<'scope' | 'depth' | 'add' | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const scopeOptions = [
    { id: 'single-paper' as const, label: isZh ? '单篇论文' : 'Single paper', icon: FileText },
    { id: 'library' as const, label: isZh ? '全部知识库' : 'Entire library', icon: Library },
    { id: 'scholar-search' as const, label: isZh ? '学术搜索' : 'Scholar Search', icon: Search },
  ];
  const depthOptions = [
    { id: 'light' as const, label: isZh ? '思考强度 低' : 'Light reasoning' },
    { id: 'medium' as const, label: isZh ? '思考强度 中' : 'Medium reasoning' },
    { id: 'deep' as const, label: isZh ? '思考强度 高' : 'Deep reasoning' },
  ];
  const selectedScope = scopeOptions.find((option) => option.id === knowledgeScope) ?? scopeOptions[0];
  const selectedDepth = depthOptions.find((option) => option.id === thinkingDepth) ?? depthOptions[1];
  const ScopeIcon = selectedScope.icon;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  const addSamplePaper = () => {
    setAttachments((current) => current.includes('Dense Passage Retrieval for Open-Domain QA.pdf')
      ? current
      : [...current, 'Dense Passage Retrieval for Open-Domain QA.pdf']);
    setOpenMenu(null);
  };

  return (
    <div className={`qa-composer ${compact ? 'qa-composer-compact' : ''}`}>
      {attachments.length > 0 ? (
        <div className="qa-attachment-row">
          {attachments.map((attachment) => (
            <span key={attachment} className="qa-attachment-chip">
              <FileText className="h-4 w-4" />
              <span>{attachment}</span>
              <button type="button" onClick={() => setAttachments((current) => current.filter((item) => item !== attachment))} aria-label={isZh ? '移除附件' : 'Remove attachment'}>
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={compact ? 2 : 3}
        placeholder={compact
          ? isZh ? '向知识助手提问，或试试「总结这篇文档」「翻译这段话…」' : 'Ask a follow-up, summarize a paper, or translate a passage…'
          : isZh ? '输入你的研究问题，例如：解释催化剂活性在化学反应动力学中的基本含义。' : 'Ask a research question, for example: explain catalyst activity in reaction kinetics.'}
        aria-label={isZh ? '学术问答输入框' : 'Scholar QA input'}
      />

      <div className="qa-composer-toolbar">
        <div className="qa-composer-actions">
          <div className="qa-control-wrap">
            <button type="button" className="qa-icon-button" onClick={() => setOpenMenu((current) => current === 'add' ? null : 'add')} aria-expanded={openMenu === 'add'} aria-label={isZh ? '添加资料' : 'Add sources'}>
              <Plus className="h-5 w-5" />
            </button>
            {openMenu === 'add' ? (
              <div className="qa-popover qa-add-popover">
                <button type="button" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" />{isZh ? '上传本地文件' : 'Upload a file'}</button>
                <button type="button" onClick={addSamplePaper}><BookOpen className="h-4 w-4" />{isZh ? '从知识库选择' : 'Choose from library'}</button>
              </div>
            ) : null}
          </div>

          <div className="qa-control-wrap">
            <button type="button" className="qa-pill-button" onClick={() => setOpenMenu((current) => current === 'scope' ? null : 'scope')} aria-expanded={openMenu === 'scope'}>
              <ScopeIcon className="h-4 w-4" />
              <span>{selectedScope.label}</span>
              <ChevronDown className={`h-3.5 w-3.5 ${openMenu === 'scope' ? 'rotate-180' : ''}`} />
            </button>
            {openMenu === 'scope' ? (
              <div className="qa-popover qa-option-popover">
                <p>{isZh ? '回答范围' : 'Answer scope'}</p>
                {scopeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button key={option.id} type="button" onClick={() => { onKnowledgeScopeChange(option.id); setOpenMenu(null); }}>
                      <Icon className="h-4 w-4" />
                      <span>{option.label}</span>
                      {knowledgeScope === option.id ? <Check className="ml-auto h-4 w-4 text-blue-600" /> : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="qa-control-wrap">
            <button type="button" className="qa-pill-button" onClick={() => setOpenMenu((current) => current === 'depth' ? null : 'depth')} aria-expanded={openMenu === 'depth'}>
              <Lightbulb className="h-4 w-4" />
              <span>{selectedDepth.label}</span>
              <ChevronDown className={`h-3.5 w-3.5 ${openMenu === 'depth' ? 'rotate-180' : ''}`} />
            </button>
            {openMenu === 'depth' ? (
              <div className="qa-popover qa-option-popover">
                <p>{isZh ? '控制回答深度与 Credits 消耗' : 'Controls depth and credit usage'}</p>
                {depthOptions.map((option) => (
                  <button key={option.id} type="button" onClick={() => { onThinkingDepthChange(option.id); setOpenMenu(null); }}>
                    <Lightbulb className="h-4 w-4" />
                    <span>{option.label}</span>
                    {thinkingDepth === option.id ? <Check className="ml-auto h-4 w-4 text-blue-600" /> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <button type="button" className="qa-submit-button" onClick={onSubmit} disabled={!value.trim()} aria-label={isZh ? '发送问题' : 'Send question'}>
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt"
        onChange={(event) => {
          const names = Array.from(event.target.files ?? []).map((file) => file.name);
          setAttachments((current) => [...current, ...names]);
          event.target.value = '';
          setOpenMenu(null);
        }}
      />
    </div>
  );
}
