import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface BlogGenerationPromptProps {
  onGenerate: () => void;
  isGenerating: boolean;
  progress: number;
}

export function BlogGenerationPrompt({ onGenerate, isGenerating, progress }: BlogGenerationPromptProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 px-6">
      <motion.div 
        className="max-w-xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
            Upgrade to Immersive Blog Mode
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
            本文目前仅有原始文献。只需一键，我们的模型将对其进行深度解析：重建段落结构、完美渲染公式，并提取核心摘要，帮您快速理解文章。
          </p>

          {!isGenerating ? (
            /* Generate Button */
            <div className="flex justify-center">
              <button
                onClick={onGenerate}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                开始解析
              </button>
            </div>
          ) : (
            /* Progress Bar */
            <div className="space-y-3">
              {/* Progress Bar */}
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gray-900 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>

              {/* Tip Text */}
              <p className="text-xs text-gray-500 text-center pt-1">
                正在快速解析文献结构、公式与摘要。
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
