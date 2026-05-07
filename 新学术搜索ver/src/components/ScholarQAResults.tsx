import React, { useState, useRef, useEffect } from 'react';
import { Check, Copy, Send } from 'lucide-react';
import { TableMode } from './TableMode';

interface Message {
  id: string;
  type: 'question' | 'text-answer' | 'table-answer';
  content: string;
  question?: string; // For table answers, the question that the table is answering
}

interface ScholarQAResultsProps {
  question: string;
  papersCount?: number;
}

export function ScholarQAResults({ question, papersCount = 9 }: ScholarQAResultsProps) {
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Conversation history
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'question',
      content: question
    },
    {
      id: '2',
      type: 'text-answer',
      content: 'default-answer'
    }
  ]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = () => {
    if (followUpQuestion.trim()) {
      const newQuestion: Message = {
        id: Date.now().toString(),
        type: 'question',
        content: followUpQuestion
      };

      // Check if the question contains "2" or table-related keywords
      const shouldGenerateTable = followUpQuestion.trim() === '2' || 
                                 followUpQuestion.includes('表格') || 
                                 followUpQuestion.includes('对比') ||
                                 followUpQuestion.includes('table');

      const newAnswer: Message = {
        id: (Date.now() + 1).toString(),
        type: shouldGenerateTable ? 'table-answer' : 'text-answer',
        content: shouldGenerateTable ? '' : 'mock-answer',
        question: shouldGenerateTable ? followUpQuestion : undefined
      };

      setMessages(prev => [...prev, newQuestion, newAnswer]);
      setFollowUpQuestion('');
      console.log('Follow-up question:', followUpQuestion);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getAnswerCopyText = (message: Message) => {
    if (message.type === 'table-answer') {
      return `表格对比：${message.question || '核心思想对比'}`;
    }

    if (message.content === 'default-answer') {
      return [
        'GRPO 与 PPO的区别',
        '',
        '一、核心定义',
        '分组采样：同一输入生成多组候选响应，构建对比样本池（医联管理多响应、代码生成等）。',
        '选定胜出者：综合性能判定最优策略（如数字孪生正确性、代码可执行性、损失误差等）。',
        '相对优势估计：组内统一K步样本块，替代 Critic 输出。',
        '策略更新：常见的奖励编码，直到样本数，套件式挖掘占比的（变松排块、KL 规避）。',
        '',
        '二、核心优势',
        '无需拔文价值显型：一-强化监督机好，减少计算量',
        '样落方素小：一个模型的优化步骤',
        '适合大规模候选评估：一合 LLM 推理并半中道硬改高效',
        '可扩展性强：一结合委奖能考行样半机火规模试验',
        '',
        '四、应用场景',
        '大语言模型（LLM）：微调强化优化',
        '多链条优化守习序列',
        '深度强化学习钱态优化 Critic 收线较慢问题',
        '已用于 DeepSeek一代号 LLM 语域强训练',
      ].join('\n');
    }

    return '这是一个后续问题的回答示例。您可以继续提问，或者输入"2"来查看表格对比模式。';
  };

  const handleCopyAnswer = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(getAnswerCopyText(message));
      setCopiedMessageId(message.id);
      window.setTimeout(() => setCopiedMessageId((current) => (current === message.id ? null : current)), 1600);
    } catch (error) {
      console.error('Failed to copy Scholar QA answer', error);
    }
  };

  const renderAnswerActions = (message: Message) => {
    const isCopied = copiedMessageId === message.id;

    return (
      <div className="mt-5 flex items-center border-t border-gray-100 pt-3">
        <button
          type="button"
          onClick={() => handleCopyAnswer(message)}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          {isCopied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{isCopied ? '已复制' : '复制'}</span>
        </button>
      </div>
    );
  };

  const renderTextAnswer = () => (
    <div className="prose prose-sm max-w-none">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">GRPO 与 PPO的区别</h2>

      <div className="space-y-4 text-gray-700 leading-relaxed">
        <div>
          <h3 className="font-medium text-gray-900 mb-2">一、核心定义</h3>
          <ul className="space-y-2 ml-5">
            <li>
              <strong>分组采样：</strong>同一输入生成多组候选响应，构建对比样本池（医联管理多响应、代码生成等）。
            </li>
            <li>
              <strong>选定胜出者：</strong>综合性能判定最优策略（如数字孪生正确性、代码可执行性、损失误差等）。
            </li>
            <li>
              <strong>相对优势估计：</strong>组内统一K步样本块，替代 Critic 输出。
            </li>
            <li>
              <strong>策略更新：</strong>常见的奖励编码，直到样本数，套件式挖掘占比的（变松排块、KL 规避）。
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-2">二、核心优势</h3>
          <ul className="space-y-2 ml-5">
            <li>无需拔文价值显型：一-强化监督机好，减少计算量</li>
            <li>样落方素小：一个模型的优化步骤</li>
            <li>适合大规模候选评估：一合 LLM 推理并半中道硬改高效</li>
            <li>可扩展性强：一结合委奖能考行样半机火规模试验</li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-2">四、应用场景</h3>
          <ul className="space-y-2 ml-5">
            <li>大语言模型（LLM）：微调强化优化</li>
            <li>多链条优化守习序列</li>
            <li>深度强化学习钱态优化 Critic 收线较慢问题</li>
            <li>已用于 DeepSeek一代号 LLM 语域强训练</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderFollowUpAnswer = () => (
    <div className="text-sm text-gray-700 leading-relaxed">
      <p>这是一个后续问题的回答示例。您可以继续提问，或者输入"2"来查看表格对比模式。</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Main Content - Scrollable */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Render conversation messages */}
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === 'question' && (
                <div className="flex justify-start mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg max-w-[80%]">
                    <span className="text-sm text-gray-700">{message.content}</span>
                  </div>
                </div>
              )}

              {message.type === 'text-answer' && (
                <div className="mb-6">
                  {message.content === 'default-answer' ? renderTextAnswer() : renderFollowUpAnswer()}
                  {renderAnswerActions(message)}
                </div>
              )}

              {message.type === 'table-answer' && (
                <div className="mb-6">
                  <TableMode question={message.question || "核心思想对比"} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Follow-up Question Input - Fixed at bottom */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="max-w-3xl mx-auto">
          {/* Quick tip */}
          <div className="mb-2 px-1">
            <div className="text-xs text-gray-500">
              <span className="font-medium">快捷指令：</span>
              <span className="ml-2">输入 <code className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded font-mono">2</code> 生成表格对比</span>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="text"
              value={followUpQuestion}
              onChange={(e) => setFollowUpQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="继续提问..."
              className="w-full px-4 py-3 pr-12 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
            />
            <button
              onClick={handleSubmit}
              disabled={!followUpQuestion.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
