import React, { useState, useEffect, useRef } from 'react';
import { Paper } from '../types';
import { BlogGenerationPrompt } from './BlogGenerationPrompt';

interface BlogViewProps {
  paper: Paper;
  language?: 'en' | 'zh' | 'ja' | 'ko' | 'id';
  scale?: number;
  isFirstVisit?: boolean;
}

type TabType = 'summary' | 'problem' | 'method' | 'results' | 'takeaways' | 'abstract';

const tabs = [
  { id: 'summary', label: 'Summary', icon: '📄' },
  { id: 'problem', label: 'Problem', icon: '❓' },
  { id: 'method', label: 'Method', icon: '⚙️' },
  { id: 'results', label: 'Results', icon: '📊' },
  { id: 'takeaways', label: 'Takeaways', icon: '💡' },
  { id: 'abstract', label: 'Abstract', icon: '📝' },
];

const tabContents = {
  summary: {
    icon: '🎓',
    title: 'Carnegie Mellon University and Meta AI researchers developed STEM',
    content: 'an architecture that replaces the up-projection in Transformer FFNs with token-indexed embeddings. This approach improves training stability and efficiency, boosts performance by up to 10% on knowledge-intensive tasks, and enhances long-context understanding, while offering a 1.33x higher training ROI.'
  },
  problem: {
    icon: '⚠️',
    title: 'Key Challenges in Current LLM Scaling',
    content: 'Traditional Mixture-of-Experts (MoE) architectures face fundamental limitations including training instability, high communication overhead, and poor interpretability as expert granularity increases. These issues become more severe at scale, limiting the effectiveness of sparse scaling approaches and creating barriers to efficient model development.'
  },
  method: {
    icon: '🔧',
    title: 'STEM: Token-Indexed Embedding Architecture',
    content: 'STEM replaces the traditional up-projection matrix in FFNs with token-indexed embedding lookups. This static, deterministic routing mechanism eliminates the training instabilities of dynamic expert selection while maintaining computational efficiency. The architecture uses learned embedding matrices that tokens directly index into, providing interpretable and efficient sparse computation.'
  },
  results: {
    icon: '📈',
    title: 'Performance Gains and Efficiency Improvements',
    content: 'STEM achieves up to 10% performance improvement on knowledge-intensive tasks compared to dense baselines. The architecture demonstrates superior training stability, 1.33x higher training ROI, and enhanced long-context understanding capabilities. Benchmarks show consistent gains across multiple domains while maintaining computational efficiency comparable to traditional approaches.'
  },
  takeaways: {
    icon: '✨',
    title: 'Key Insights and Practical Implications',
    content: 'STEM demonstrates that static, token-indexed approaches can outperform dynamic routing mechanisms. The architecture offers better interpretability, more stable training dynamics, and improved parameter efficiency. These benefits make STEM particularly suitable for resource-constrained environments and applications requiring robust, predictable model behavior at scale.'
  },
  abstract: {
    icon: '📋',
    title: 'Research Abstract',
    content: 'This paper introduces STEM (Scaling Transformers with Embedding Modules), a novel architecture for large language models that addresses fundamental challenges in sparse scaling. By replacing traditional feed-forward network projections with token-indexed embeddings, STEM achieves superior training stability, computational efficiency, and model interpretability while maintaining or exceeding the performance of existing approaches.'
  }
};

const sections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'core-architecture', title: 'Core Architecture and Design' },
  { id: 'theoretical-foundation', title: 'Theoretical Foundation and System Optimizations' },
  { id: 'training-stability', title: 'Training Stability and Performance Results' },
  { id: 'ablation-studies', title: 'Ablation Studies and Design Validation' },
  { id: 'significance', title: 'Significance and Future Directions' },
  { id: 'citations', title: 'Relevant Citations' },
];

export function BlogView({ paper, language = 'en', scale = 1, isFirstVisit = false }: BlogViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [activeSection, setActiveSection] = useState<string>('introduction');
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  
  // Blog generation states
  const [blogGenerated, setBlogGenerated] = useState(!isFirstVisit);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Handle blog generation
  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Fast mock for prototype demos: finish parsing in about 4 seconds.
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setBlogGenerated(true);
          return 100;
        }
        return Math.min(100, prev + 4);
      });
    }, 160);

    // Cleanup on unmount
    return () => clearInterval(interval);
  };

  // Track scroll progress and active section
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const scrollTop = contentRef.current.scrollTop;
      const scrollHeight = contentRef.current.scrollHeight - contentRef.current.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));

      // Update active section based on scroll position
      // Find which section is currently most visible in the viewport
      let closestSection = sections[0];
      let closestDistance = Infinity;

      sections.forEach((section) => {
        const element = sectionRefs.current[section.id];
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const containerRect = contentRef.current!.getBoundingClientRect();
        
        // Calculate distance from section top to viewport top
        const distance = Math.abs(rect.top - containerRect.top);
        
        // If this section is closer to the top than the previous closest
        if (distance < closestDistance && rect.top <= containerRect.top + 300) {
          closestDistance = distance;
          closestSection = section;
        }
      });

      setActiveSection(closestSection.id);
    };

    const container = contentRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Trigger initial check
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element && contentRef.current) {
      const containerTop = contentRef.current.getBoundingClientRect().top;
      const elementTop = element.getBoundingClientRect().top;
      const offset = elementTop - containerTop - 20;
      
      // Scroll to the section
      contentRef.current.scrollTo({
        top: contentRef.current.scrollTop + offset,
        behavior: 'smooth'
      });
      
      // Update active section immediately for better UX
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-white">
      {!blogGenerated ? (
        /* Show generation prompt if blog hasn't been generated yet */
        <BlogGenerationPrompt 
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          progress={generationProgress}
        />
      ) : (
        <>
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto" ref={contentRef}>
            <div 
              className="max-w-4xl mx-auto px-8 py-8 transition-transform origin-top"
              style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
            >
              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {paper.title}
              </h1>

              {/* Date */}
              <p className="text-sm text-gray-500 mb-2">January 15, 2026</p>

              {/* Authors */}
              <p className="text-sm text-gray-700 mb-8">
                {paper.authors.join(', ')}
              </p>

              {/* Tab Cards */}
              <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-gray-900 bg-gray-100 text-gray-900'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Translation Notice */}
              {language !== 'en' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-6 flex items-start gap-3">
                  <span className="text-lg">🌐</span>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Translation Active:</span> This content is being displayed in {
                      language === 'zh' ? 'Chinese' :
                      language === 'ja' ? 'Japanese' :
                      language === 'ko' ? 'Korean' :
                      'Indonesian'
                    }. <span className="text-gray-500">(AI-powered translation for demonstration)</span>
                  </div>
                </div>
              )}

              {/* Dynamic Content Card based on active tab */}
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{tabContents[activeTab].icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      {tabContents[activeTab].title}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {tabContents[activeTab].content}
                    </p>
                  </div>
                </div>
              </div>

              {/* Article Sections */}
              <div className="space-y-10">
                {/* Introduction */}
                <section
                  id="introduction"
                  ref={(el) => (sectionRefs.current['introduction'] = el)}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    Large language models (LLMs) have achieved remarkable capabilities through scaling, but this progress comes with 
                    significant challenges in training stability, computational efficiency, and interpretability. The dominant approach for scaling 
                    —Mixture-of-Experts (MoE) architectures—faces fundamental issues including training instability, high communication 
                    overhead and poor interpretability as expert granularity increases. This paper introduces STEM (Scaling Transformers with 
                    Embedding Modules), a new architecture that addresses these challenges through a static, token-indexed approach to 
                    sparse scaling.
                  </p>
                  
                  {/* Figure placeholder */}
                  <div className="bg-gray-100 border border-gray-300 rounded-lg p-8 mb-4">
                    <div className="aspect-[16/10] bg-white rounded flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <p className="text-sm text-gray-500">Figure 1: Model Architecture Comparison</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 italic mb-4">
                    Figure 1: STEM achieves lower validation perplexity compared to dense baselines while using comparable computational resources.
                  </p>
                </section>

                {/* Core Architecture */}
                <section
                  id="core-architecture"
                  ref={(el) => (sectionRefs.current['core-architecture'] = el)}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Core Architecture and Design</h2>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    STEM fundamentally reimagines the Feed-Forward Network (FFN) structure by replacing the up-projection matrix with 
                    token-indexed embedding lookups. In a standard SwiGLU FFN, the computation follows:
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                    <code className="text-sm text-gray-800 font-mono">
                      y = (W_gate(x) ⊙ SiLU(W_up(x))) × W_down
                    </code>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    STEM replaces this with an embedding-based approach where tokens directly index into learned embedding matrices, 
                    providing a more interpretable and efficient sparse computation mechanism.
                  </p>
                </section>

                {/* Theoretical Foundation */}
                <section
                  id="theoretical-foundation"
                  ref={(el) => (sectionRefs.current['theoretical-foundation'] = el)}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Theoretical Foundation and System Optimizations
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    The theoretical foundation of STEM rests on three key insights: First, the embedding-based approach provides natural 
                    sparsity through selective token activation. Second, the static routing eliminates the training instabilities associated with 
                    dynamic expert selection in MoE models. Third, the architecture enables better parameter efficiency by allowing fine-grained 
                    control over model capacity without proportional increases in computation.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    System optimizations include efficient kernel implementations for embedding lookups, memory-optimized gradient 
                    computation, and specialized attention mechanisms that leverage the sparse activation patterns inherent to the STEM design.
                  </p>
                </section>

                {/* Training Stability */}
                <section
                  id="training-stability"
                  ref={(el) => (sectionRefs.current['training-stability'] = el)}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Training Stability and Performance Results
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    STEM demonstrates significant improvements in training stability compared to traditional MoE approaches. The static 
                    routing mechanism eliminates the load balancing challenges that plague dynamic expert selection, resulting in more 
                    predictable training dynamics and faster convergence.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    Performance benchmarks show consistent gains across multiple domains, with particularly strong results on 
                    knowledge-intensive tasks where the embedding-based approach can effectively capture and retrieve factual information. 
                    The architecture achieves up to 10% improvement on these tasks while maintaining competitive performance on 
                    general language understanding benchmarks.
                  </p>
                </section>

                {/* Ablation Studies */}
                <section
                  id="ablation-studies"
                  ref={(el) => (sectionRefs.current['ablation-studies'] = el)}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Ablation Studies and Design Validation
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    Comprehensive ablation studies validate the key design choices in STEM. Experiments demonstrate that the 
                    embedding-based approach outperforms various baseline configurations, including traditional dense FFNs and 
                    dynamic MoE variants. The studies also reveal optimal hyperparameter settings for embedding dimensions, 
                    sparsity levels, and layer configurations.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    Critical design decisions, such as the choice of embedding lookup mechanisms and the integration with existing 
                    Transformer components, are systematically evaluated to ensure robust performance across diverse scenarios.
                  </p>
                </section>

                {/* Significance */}
                <section
                  id="significance"
                  ref={(el) => (sectionRefs.current['significance'] = el)}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Significance and Future Directions
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    STEM represents a paradigm shift in how we approach model scaling for large language models. By demonstrating 
                    that static, token-indexed approaches can outperform dynamic routing mechanisms, this work opens new avenues 
                    for research in efficient model architectures.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    Future research directions include: exploring hybrid architectures that combine STEM with other sparsity techniques, 
                    investigating the interpretability benefits of embedding-based routing, and extending the approach to multimodal settings. 
                    The higher training ROI demonstrated by STEM also suggests promising applications in resource-constrained environments.
                  </p>
                </section>

                {/* Citations */}
                <section
                  id="citations"
                  ref={(el) => (sectionRefs.current['citations'] = el)}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Relevant Citations</h2>
                  <div className="space-y-3">
                    <div className="pl-4 border-l-2 border-gray-300">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">[1]</span> Vaswani et al. (2017). "Attention Is All You Need"
                      </p>
                    </div>
                    <div className="pl-4 border-l-2 border-gray-300">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">[2]</span> Shazeer et al. (2017). "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer"
                      </p>
                    </div>
                    <div className="pl-4 border-l-2 border-gray-300">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">[3]</span> Fedus et al. (2022). "Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity"
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Minimalist Vertical Navigation Rail */}
          <div className="w-16 relative group">
            {/* Navigation container - 1/4 of screen height, fixed to center */}
            <div className="fixed top-1/2 -translate-y-1/2 h-1/4 min-h-48 flex items-center justify-center w-16" style={{ right: '1rem' }}>
              {/* Vertical line (progress bar) */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gray-300">
                {/* Progress indicator */}
                <div
                  className="absolute top-0 left-0 w-full bg-blue-500 transition-all duration-300"
                  style={{ height: `${scrollProgress}%` }}
                />
              </div>

              {/* Navigation dots (anchors) */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex flex-col justify-between py-2">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="relative -ml-1.5"
                  >
                    {/* Dot */}
                    <div
                      className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-blue-500 border-blue-500 scale-110'
                          : 'bg-white border-gray-300 hover:border-blue-400 hover:scale-105'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Chapter list container - appears on hover */}
              <div className="absolute right-full mr-3 top-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto flex items-center">
                <div className="bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3 px-2">Table of Contents</h3>
                  <div className="space-y-1">
                    {sections.map((section, index) => (
                      <button
                        key={section.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          scrollToSection(section.id);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors cursor-pointer ${
                          activeSection === section.id
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xs text-gray-400 mt-0.5 font-medium">{index + 1}.</span>
                          <span className="flex-1 leading-relaxed">{section.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
