import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDownUp,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Plus,
  Search,
  XCircle,
} from 'lucide-react';
import { Paper } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface MyLibraryProps {
  papers: Paper[];
  onPaperClick: (paper: Paper) => void;
  onOpenReader: (file?: File) => void;
}

type LibraryStatus = 'in-library' | 'error' | 'processing' | 'missing-pdf';

const statusSequence: LibraryStatus[] = [
  'in-library',
  'in-library',
  'error',
  'processing',
  'processing',
  'processing',
  'missing-pdf',
  'processing',
  'processing',
  'in-library',
  'in-library',
  'in-library',
  'in-library',
  'in-library',
  'in-library',
];

export function MyLibrary({ papers, onPaperClick, onOpenReader }: MyLibraryProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const localFileInputRef = useRef<HTMLInputElement | null>(null);
  const { language } = useLanguage();
  const isZh = language === 'zh';

  const rows = papers.slice(0, 15).map((paper, index) => ({
    paper,
    status: statusSequence[index] ?? 'in-library',
    date: '2026-05',
    author: index === 14 ? 'Gomez, R.' : 'Sokolov, A., et al.',
  }));

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedRows(next);
  };

  const openLocalFilePicker = () => {
    localFileInputRef.current?.click();
  };

  const handleLocalFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      onOpenReader(file);
    }

    event.target.value = '';
  };

  const renderStatus = (status: LibraryStatus) => {
    if (status === 'in-library') {
      return (
        <span className="inline-flex items-center gap-2 font-medium text-blue-600">
          <CheckCircle2 className="h-4 w-4 fill-blue-600 text-white" />
          {isZh ? '已入库' : 'In library'}
        </span>
      );
    }

    if (status === 'error') {
      return (
        <span className="inline-flex items-center gap-3">
          <span className="inline-flex items-center gap-2 font-medium text-red-500">
            <AlertCircle className="h-4 w-4 fill-red-500 text-white" />
            {isZh ? '出错' : 'Error'}
          </span>
          <button className="rounded-full bg-blue-500 px-4 py-1 text-sm font-medium text-white shadow-sm transition hover:bg-blue-600">
            {isZh ? '重试' : 'Retry'}
          </button>
        </span>
      );
    }

    if (status === 'missing-pdf') {
      return (
        <span className="inline-flex items-center gap-3">
          <span className="inline-flex items-center gap-2 font-medium text-gray-500">
            <XCircle className="h-4 w-4 text-red-500" />
            {isZh ? '无PDF' : 'No PDF'}
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openLocalFilePicker();
            }}
            className="rounded-full bg-blue-500 px-4 py-1 text-sm font-medium text-white shadow-sm transition hover:bg-blue-600"
          >
            {isZh ? '上传' : 'Upload'}
          </button>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 font-medium text-gray-700">
        <span className="h-4 w-4 rounded-full border-2 border-blue-400 border-t-transparent" />
        {isZh ? '处理中' : 'Processing'}
      </span>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden bg-[#eef6ff] p-5">
      <input
        ref={localFileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleLocalFileSelect}
      />
      <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[1.4rem] bg-white px-5 py-5 shadow-[0_20px_60px_-46px_rgba(15,23,42,0.35)]">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-950">
            {isZh ? '我的知识库' : 'My Library'}
          </h1>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-red-50 text-sm font-bold text-red-500">Z</span>
              <span>{isZh ? '从Zotero导入' : 'Import from Zotero'}</span>
            </button>
            <button
              type="button"
              onClick={openLocalFilePicker}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <BookOpen className="h-4 w-4" />
              <span>{isZh ? '打开本地文件' : 'Open local file'}</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-8 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />
              <span>{isZh ? '上传' : 'Upload'}</span>
            </button>
          </div>
        </div>

        <div className="mt-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <label className="flex h-10 w-[31rem] max-w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 text-sm shadow-sm">
              <Search className="h-5 w-5 flex-shrink-0 text-gray-400" />
              <input
                className="min-w-0 flex-1 bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
                placeholder={isZh ? 'Title、Creator、Year' : 'Title, Creator, Year'}
              />
            </label>
            <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900">
              <Plus className="h-4 w-4" />
              <span>{isZh ? '添加列' : 'Add column'}</span>
            </button>
            <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900">
              <ArrowDownUp className="h-4 w-4" />
              <span>{isZh ? '传输' : 'Transfer'}</span>
            </button>
          </div>

          <div className="flex items-center gap-5">
            <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900">
              <Filter className="h-4 w-4" />
              <span>{isZh ? '筛选' : 'Filter'}</span>
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900">
              <Download className="h-4 w-4" />
              <span>{isZh ? '导出' : 'Export'}</span>
            </button>
          </div>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-hidden rounded-2xl border border-gray-200">
          <div className="grid grid-cols-[48px_minmax(28rem,1fr)_15rem_15.5rem_8.5rem_5rem] border-b border-gray-200 bg-gray-50/70 text-sm font-semibold text-gray-500">
            <div className="flex items-center justify-center border-r border-gray-200 py-4">
              <span className="h-5 w-5 rounded-md border border-gray-300 bg-white" />
            </div>
            <div className="border-r border-gray-200 px-5 py-4">{isZh ? '标题' : 'Title'}</div>
            <div className="border-r border-gray-200 px-5 py-4">{isZh ? '作者' : 'Author'}</div>
            <div className="border-r border-gray-200 px-5 py-4">{isZh ? '状态' : 'Status'}</div>
            <div className="border-r border-gray-200 px-5 py-4">{isZh ? '日期' : 'Date'}</div>
            <div className="flex items-center justify-center py-4">
              <Plus className="h-5 w-5" />
            </div>
          </div>

          <div className="h-full overflow-auto bg-white">
            {rows.map(({ paper, status, author, date }, index) => {
              const selected = selectedRows.has(paper.id);

              return (
                <div
                  key={`${paper.id}-${index}`}
                  className={`grid grid-cols-[48px_minmax(28rem,1fr)_15rem_15.5rem_8.5rem_5rem] border-b border-gray-200 text-[1rem] text-gray-700 transition ${
                    selected || index === 2 ? 'bg-[#eef6ff]' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center border-r border-gray-200 py-3">
                    <button
                      type="button"
                      onClick={() => toggleRow(paper.id)}
                      className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                        selected
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 bg-white text-transparent hover:border-blue-300'
                      }`}
                      aria-label={selected ? 'Deselect row' : 'Select row'}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onPaperClick(paper)}
                    className="truncate border-r border-gray-200 px-5 py-3 text-left text-gray-800 transition hover:text-blue-600"
                    title={paper.title}
                  >
                    {paper.title}
                  </button>
                  <div className="truncate border-r border-gray-200 px-5 py-3" title={author}>
                    {author}
                  </div>
                  <div className="border-r border-gray-200 px-5 py-3">
                    {renderStatus(status)}
                  </div>
                  <div className="border-r border-gray-200 px-5 py-3 text-gray-600">
                    {date}
                  </div>
                  <div className="py-3" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3 text-sm text-gray-500">
          <button className="rounded-lg p-2 transition hover:bg-gray-100 hover:text-gray-900">
            <ChevronLeft className="h-5 w-5" />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`h-10 w-10 rounded-lg border text-base transition ${
                page === 2
                  ? 'border-gray-200 bg-gray-100 font-semibold text-gray-900'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <span className="px-2 text-base">...</span>
          <button className="h-10 w-10 rounded-lg border border-gray-200 bg-white text-base text-gray-600 transition hover:bg-gray-50">
            15
          </button>
          <button className="rounded-lg p-2 transition hover:bg-gray-100 hover:text-gray-900">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
