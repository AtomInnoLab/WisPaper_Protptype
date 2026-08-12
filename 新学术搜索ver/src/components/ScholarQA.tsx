import React, { useState } from 'react';
import { ScholarQAComposer, type QAKnowledgeScope, type QAThinkingDepth } from './ScholarQAComposer';
import { ScholarQAResults } from './ScholarQAResults';
import { useLanguage } from '../contexts/LanguageContext';

interface ScholarQAProps {
  papersCount?: number;
  onReset?: () => void;
}

export function ScholarQA({ papersCount = 9, onReset }: ScholarQAProps) {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const [question, setQuestion] = useState('');
  const [submittedQuestion, setSubmittedQuestion] = useState('');
  const [knowledgeScope, setKnowledgeScope] = useState<QAKnowledgeScope>('single-paper');
  const [thinkingDepth, setThinkingDepth] = useState<QAThinkingDepth>('medium');

  const handleSubmit = () => {
    const nextQuestion = question.trim();
    if (!nextQuestion) return;
    setSubmittedQuestion(nextQuestion);
    setQuestion('');
  };

  const handleReset = React.useCallback(() => {
    setQuestion('');
    setSubmittedQuestion('');
  }, []);

  React.useEffect(() => {
    if (!onReset) return undefined;
    (window as Window & { __scholarQAReset?: () => void }).__scholarQAReset = handleReset;
    return () => {
      delete (window as Window & { __scholarQAReset?: () => void }).__scholarQAReset;
    };
  }, [handleReset, onReset]);

  return (
    <div className="scholar-qa-shell">
      <style>{`
        .scholar-qa-shell {
          --qa-ink: #20262e;
          --qa-body: #657286;
          --qa-muted: #93a0b2;
          --qa-line: #e2e8f0;
          --qa-soft: #f5f7f9;
          --qa-blue-soft: #eef7ff;
          position: relative;
          display: flex;
          flex: 1;
          height: 100vh;
          max-height: 100vh;
          min-width: 0;
          min-height: 0;
          overflow: hidden;
          background: #f4f9fd;
          color: var(--qa-ink);
        }

        .scholar-qa-shell * { box-sizing: border-box; }

        .qa-start-page {
          display: flex;
          flex: 1;
          height: calc(100vh - 16px);
          max-height: calc(100vh - 16px);
          min-height: 0;
          align-items: center;
          justify-content: center;
          margin: 8px 10px 8px 0;
          border-radius: 20px;
          background: linear-gradient(180deg, #ffffff 0%, #f6fbff 72%, #f4f9fd 100%);
          padding: 48px 32px clamp(120px, 28vh, 420px);
        }

        .qa-start-content { width: min(860px, 100%); }
        .qa-start-content h1 {
          margin: 0 0 42px;
          color: var(--qa-ink);
          font-size: clamp(28px, 3vw, 42px);
          line-height: 1.2;
          font-weight: 700;
          letter-spacing: -0.025em;
          text-align: center;
        }

        .qa-composer {
          position: relative;
          width: 100%;
          min-height: 150px;
          border: 1px solid #dfe5ec;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 14px 34px rgba(43, 55, 72, 0.08), 0 2px 6px rgba(43, 55, 72, 0.04);
          padding: 16px 16px 14px;
        }

        .qa-composer textarea {
          display: block;
          width: 100%;
          min-height: 72px;
          border: 0;
          outline: 0;
          resize: none;
          background: transparent;
          color: var(--qa-ink);
          padding: 0 2px 8px;
          font: inherit;
          font-size: 16px;
          line-height: 24px;
        }

        .qa-composer textarea::placeholder { color: #9aa6b7; }
        .qa-composer-toolbar { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
        .qa-composer-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
        .qa-control-wrap { position: relative; }

        .qa-icon-button,
        .qa-pill-button {
          display: inline-flex;
          min-height: 38px;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border: 1px solid #e1e7ee;
          border-radius: 999px;
          background: #fff;
          color: #44505f;
          padding: 7px 13px;
          font-size: 14px;
          line-height: 20px;
          cursor: pointer;
          transition: background .16s ease, border-color .16s ease, color .16s ease;
        }

        .qa-icon-button { width: 38px; padding: 0; }
        .qa-icon-button:hover,
        .qa-pill-button:hover { border-color: #cfd8e3; background: #f8fafc; color: #111827; }

        .qa-submit-button {
          display: inline-flex;
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 50%;
          background: #23282f;
          color: #fff;
          cursor: pointer;
          transition: transform .16s ease, background .16s ease;
        }

        .qa-submit-button:hover:not(:disabled) { background: #111827; transform: translateY(-1px); }
        .qa-submit-button:disabled { background: #d9dee5; color: #fff; cursor: not-allowed; }

        .qa-popover {
          position: absolute;
          left: 0;
          bottom: calc(100% + 10px);
          z-index: 40;
          width: 230px;
          border: 1px solid var(--qa-line);
          border-radius: 14px;
          background: #fff;
          padding: 7px;
          box-shadow: 0 18px 48px rgba(34, 45, 60, 0.14);
        }

        .qa-popover p { margin: 4px 8px 7px; color: var(--qa-muted); font-size: 11px; line-height: 16px; }
        .qa-popover button {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 9px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #4b5563;
          padding: 9px 10px;
          font-size: 13px;
          text-align: left;
          cursor: pointer;
        }
        .qa-popover button:hover { background: #f3f6f9; color: #111827; }

        .qa-attachment-row { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 10px; }
        .qa-attachment-chip {
          display: inline-flex;
          max-width: min(360px, 100%);
          align-items: center;
          gap: 7px;
          border-radius: 10px;
          background: #f0f2f5;
          color: #394352;
          padding: 7px 9px;
          font-size: 12px;
        }
        .qa-attachment-chip > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .qa-attachment-chip button { border: 0; background: transparent; color: #788497; padding: 0; cursor: pointer; }

        .qa-result-page {
          position: relative;
          display: flex;
          flex: 1;
          height: calc(100vh - 16px);
          max-height: calc(100vh - 16px);
          min-width: 0;
          min-height: 0;
          flex-direction: column;
          margin: 8px 10px 8px 0;
          overflow: hidden;
          border-radius: 20px;
          background: #fff;
        }

        .qa-result-header {
          display: flex;
          min-height: 54px;
          align-items: center;
          border-bottom: 1px solid #f0f2f5;
          padding: 0 22px;
          color: #29313c;
          font-size: 15px;
          font-weight: 600;
        }

        .qa-conversation-scroll { flex: 1; min-height: 0; overflow-y: auto; padding: 38px 28px 210px; }
        .qa-conversation { width: min(860px, 100%); margin: 0 auto; }
        .qa-question-row { display: flex; justify-content: flex-end; margin-bottom: 30px; }
        .qa-question-bubble { max-width: 72%; border-radius: 16px 16px 4px 16px; background: #dfefff; color: #3e4a59; padding: 13px 18px; font-size: 15px; line-height: 22px; }

        .qa-brand { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; color: #2f3742; font-size: 14px; font-weight: 600; }
        .qa-brand img { width: 22px; height: 22px; object-fit: contain; }
        .qa-thinking-panel { margin-bottom: 22px; overflow: hidden; border-radius: 12px; background: #f5f7f9; }
        .qa-thinking-toggle { display: flex; width: 100%; align-items: center; justify-content: space-between; border: 0; background: transparent; color: #738095; padding: 13px 18px; font-size: 13px; cursor: pointer; }
        .qa-thinking-content { border-top: 1px solid #eaedf1; padding: 5px 24px 18px; color: #8390a2; font-size: 13px; line-height: 1.65; }
        .qa-thinking-step { position: relative; padding: 12px 0 7px 26px; }
        .qa-thinking-step::before { content: ''; position: absolute; left: 6px; top: 21px; width: 7px; height: 7px; border-radius: 50%; background: #aeb8c5; }
        .qa-thinking-step:not(:last-child)::after { content: ''; position: absolute; left: 9px; top: 32px; bottom: -7px; width: 1px; background: #d7dde5; }
        .qa-thinking-step strong { display: block; margin-bottom: 4px; color: #667386; font-size: 13px; }
        .qa-source-list { margin: 7px 0 0; padding-left: 18px; }
        .qa-source-list a { color: #3287ff; text-decoration: none; }

        .qa-answer { color: #4a5565; font-size: 15px; line-height: 1.75; }
        .qa-answer h2 { margin: 0 0 14px; color: #20262e; font-size: 21px; line-height: 30px; font-weight: 700; }
        .qa-answer h3 { margin: 18px 0 7px; color: #252c35; font-size: 16px; line-height: 24px; font-weight: 700; }
        .qa-answer p { margin: 0 0 10px; }
        .qa-answer ol { margin: 6px 0 10px; padding-left: 24px; }
        .qa-citation { display: inline-flex; min-width: 19px; height: 19px; align-items: center; justify-content: center; border: 0; border-radius: 5px; background: #edf5ff; color: #2678df; padding: 0 5px; font-size: 10px; font-weight: 700; vertical-align: super; cursor: pointer; transition: background .16s ease, color .16s ease, transform .16s ease; }
        .qa-citation:hover { background: #dbeafe; color: #145fbe; transform: translateY(-1px); }
        .qa-citation:focus-visible { outline: 2px solid #60a5fa; outline-offset: 2px; }
        .qa-answer-actions { display: flex; align-items: center; gap: 4px; margin-top: 21px; color: #95a1b1; }
        .qa-answer-actions button { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border: 0; border-radius: 7px; background: transparent; color: inherit; cursor: pointer; }
        .qa-answer-actions button:hover { background: #f2f5f7; color: #4b5563; }
        .qa-answer-actions span { margin-left: 8px; font-size: 11px; color: #b2bbc7; }

        .qa-scroll-bottom { position: absolute; left: 50%; bottom: 190px; z-index: 10; display: inline-flex; width: 38px; height: 38px; align-items: center; justify-content: center; border: 1px solid #e3e8ee; border-radius: 50%; background: #fff; color: #738095; box-shadow: 0 5px 14px rgba(45, 55, 68, .12); transform: translateX(-50%); cursor: pointer; }
        .qa-result-composer { position: absolute; left: 50%; bottom: 30px; z-index: 20; width: min(860px, calc(100% - 56px)); transform: translateX(-50%); }
        .qa-composer-compact { min-height: 134px; border-radius: 18px; }
        .qa-composer-compact textarea { min-height: 56px; font-size: 14px; }
        .qa-ai-note { margin-top: 8px; color: #c1c8d1; font-size: 10px; text-align: center; }

        .qa-citation-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15, 23, 42, .46);
          padding: 24px;
          backdrop-filter: blur(2px);
        }
        .qa-citation-dialog {
          position: relative;
          width: min(620px, 100%);
          border: 1px solid rgba(226, 232, 240, .9);
          border-radius: 22px;
          background: #fff;
          padding: 32px;
          box-shadow: 0 28px 80px rgba(15, 23, 42, .22);
        }
        .qa-citation-close {
          position: absolute;
          top: 18px;
          right: 18px;
          display: inline-flex;
          width: 36px;
          height: 36px;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 50%;
          background: transparent;
          color: #7b8797;
          cursor: pointer;
        }
        .qa-citation-close:hover { background: #f1f5f9; color: #253041; }
        .qa-citation-kicker { display: flex; align-items: center; gap: 8px; margin: 0 48px 14px 0; color: #6b7788; font-size: 12px; font-weight: 600; }
        .qa-citation-oa { border-radius: 999px; background: #e9f9f1; color: #16805b; padding: 4px 8px; font-size: 10px; }
        .qa-citation-dialog h2 { margin: 0 48px 12px 0; color: #20262e; font-size: 21px; line-height: 1.35; font-weight: 700; letter-spacing: -.01em; }
        .qa-citation-authors { margin: 0 48px 5px 0; color: #657286; font-size: 14px; line-height: 1.65; }
        .qa-citation-meta { margin: 0; color: #8b97a7; font-size: 13px; }
        .qa-citation-dialog-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
        .qa-citation-dialog-actions a { display: inline-flex; min-height: 40px; align-items: center; justify-content: center; gap: 7px; border-radius: 10px; padding: 9px 14px; font-size: 13px; font-weight: 600; text-decoration: none; transition: background .16s ease, border-color .16s ease; }
        .qa-citation-reader { background: #20262e; color: #fff; }
        .qa-citation-reader:hover { background: #111827; }
        .qa-citation-source { border: 1px solid #dce3eb; background: #fff; color: #354153; }
        .qa-citation-source:hover { border-color: #c4cfdb; background: #f8fafc; }

        @media (max-width: 760px) {
          .qa-start-page { margin-right: 0; border-radius: 0; padding: 32px 16px 100px; }
          .qa-start-content h1 { margin-bottom: 28px; font-size: 28px; }
          .qa-result-page { margin-right: 0; border-radius: 0; }
          .qa-conversation-scroll { padding: 24px 16px 200px; }
          .qa-result-composer { bottom: 18px; width: calc(100% - 24px); }
          .qa-pill-button span { max-width: 116px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .qa-question-bubble { max-width: 88%; }
          .qa-citation-backdrop { align-items: flex-end; padding: 12px; }
          .qa-citation-dialog { border-radius: 20px; padding: 26px 20px 20px; }
          .qa-citation-dialog h2 { margin-right: 34px; font-size: 18px; }
          .qa-citation-dialog-actions { flex-direction: column; }
          .qa-citation-dialog-actions a { width: 100%; }
        }
      `}</style>

      {submittedQuestion ? (
        <ScholarQAResults
          question={submittedQuestion}
          papersCount={papersCount}
          knowledgeScope={knowledgeScope}
          thinkingDepth={thinkingDepth}
        />
      ) : (
        <main className="qa-start-page">
          <div className="qa-start-content">
            <h1>{isZh ? '从一个问题，打开你的知识库' : 'Open your knowledge with a question'}</h1>
            <ScholarQAComposer
              value={question}
              onChange={setQuestion}
              onSubmit={handleSubmit}
              knowledgeScope={knowledgeScope}
              onKnowledgeScopeChange={setKnowledgeScope}
              thinkingDepth={thinkingDepth}
              onThinkingDepthChange={setThinkingDepth}
            />
          </div>
        </main>
      )}
    </div>
  );
}
