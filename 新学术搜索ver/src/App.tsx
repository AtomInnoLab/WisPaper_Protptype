import React, { useState, useMemo } from "react";
import { SearchBar } from "./components/SearchBar";
import { SearchResults } from "./components/SearchResults";
import { SearchThinkingPanel } from "./components/SearchThinkingPanel";
import { LeftSidebar } from "./components/LeftSidebar";
import { RightPanel } from "./components/RightPanel";
import { PaperDetail } from "./components/PaperDetail";
import { MyLibrary } from "./components/MyLibrary";
import { ScholarSearchHome } from "./components/ScholarSearchHome";
import { HomePage } from "./components/HomePage";
import { ScholarQA } from "./components/ScholarQA";
import { PaperReproduction } from "./components/PaperReproduction";
import { IdeaDiscovery } from "./components/IdeaDiscovery";
import { AllFeedsWorkspace } from "./components/AllFeedsWorkspace";
import { FudanCollectionResults } from "./components/FudanCollectionResults";
import { FloatingTaskButton } from "./components/FloatingTaskButton";
import { SearchMoreButton } from "./components/SearchMoreButton";
import { NewbieTasksModal } from "./components/NewbieTasksModal";
import { InviteModal } from "./components/InviteModal";
import { PaywallModal } from "./components/PaywallModal";
import { RechargeModal } from "./components/RechargeModal";
import { NotificationDrawer } from "./components/NotificationDrawer";
import { LanguageProvider } from "./contexts/LanguageContext";
import { mockPapers } from "./data/mockPapers";
import { mockBooks } from "./data/mockBooks";
import { mockTheses } from "./data/mockTheses";
import { Paper, FilterOptions } from "./types";

// Suppress Figma-specific prop warnings in development
if (typeof console !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('React does not recognize') &&
      (args[0].includes('_fg') || args[0].includes('data-fg'))
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

// WisPaper Main Application
export default function App() {
  const defaultFilters: FilterOptions = {
    years: [],
    categories: [],
    sortBy: "relevance",
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [selectedPaper, setSelectedPaper] =
    useState<Paper | null>(null);
  const [viewMode, setViewMode] = useState<
    "home" | "list" | "detail" | "library" | "scholar-qa" | "all-feeds" | "paper-reproduction" | "idea-discovery" | "fudan-collection-search"
  >("home");
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showDeepSearchTooltip, setShowDeepSearchTooltip] = useState(false);
  const [scholarQAKey, setScholarQAKey] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  const filteredPapers = useMemo(() => {
    let results = mockPapers;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const queryWords = query.split(/\s+/).filter(w => w.length > 1); // Filter out single characters
      
      console.log('Search query:', query);
      console.log('Query words:', queryWords);
      console.log('Total papers available:', mockPapers.length);
      
      // First try to find matches
      let matchedResults = results.filter(
        (paper) => {
          const searchText = `${paper.title} ${paper.abstract} ${paper.authors.join(' ')} ${paper.categories.join(' ')} ${paper.venue || ''}`.toLowerCase();
          
          // If any word in the query matches, include the paper
          return queryWords.some(word => searchText.includes(word)) ||
                 paper.title.toLowerCase().includes(query) ||
                 paper.abstract.toLowerCase().includes(query) ||
                 paper.authors.some((author) => author.toLowerCase().includes(query));
        }
      );
      
      console.log('Matched results:', matchedResults.length);
      
      // If search results are too few (less than 30), return the first 50 papers instead
      // This ensures that clicking example questions always shows results
      if (matchedResults.length < 30) {
        console.log('Less than 30 results, returning first 50 papers');
        results = mockPapers.slice(0, 50);
      } else {
        results = matchedResults;
      }
      
      console.log('Final results count:', results.length);
    }

    // Year filter
    if (filters.years.length > 0) {
      results = results.filter((paper) =>
        filters.years.includes(paper.year),
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      results = results.filter((paper) =>
        filters.categories.some((cat) =>
          paper.categories.includes(cat),
        ),
      );
    }

    // Sort
    switch (filters.sortBy) {
      case "date":
        results = [...results].sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return (
            new Date(b.publishedDate).getTime() -
            new Date(a.publishedDate).getTime()
          );
        });
        break;
      case "citations":
        results = [...results].sort(
          (a, b) => b.citations - a.citations,
        );
        break;
      case "relevance":
      default:
        break;
    }

    return results;
  }, [searchQuery, filters]);

  const handleSelectPaper = (paper: Paper) => {
    setSelectedPaper(paper);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
  };

  const handleResetScholarQA = () => {
    setScholarQAKey(prev => prev + 1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setHasSearched(true);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setHasSearched(false);
    }
  };

  const handleSearchMore = () => {
    setIsLoadingMore(true);
    // Simulate loading more papers
    setTimeout(() => {
      setIsLoadingMore(false);
      console.log('Loading more papers...');
      // In a real app, you would fetch more papers from an API here
    }, 1500);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
    setFilters(defaultFilters);
  };

  const handleStartSearchFromHome = (query?: string) => {
    setSelectedPaper(null);
    setFilters(defaultFilters);
    setViewMode("list");

    if (query?.trim()) {
      setSearchQuery(query.trim());
      setHasSearched(true);
      return;
    }

    setSearchQuery('');
    setHasSearched(false);
  };

  const isReaderView = viewMode === "detail";

  return (
    <LanguageProvider>
      <div className={isReaderView ? "h-screen overflow-hidden bg-white flex" : "min-h-screen bg-white flex"}>
        {/* Left Sidebar - Only show in list view, library view, and scholar-qa view */}
        {(viewMode === "list" || viewMode === "library" || viewMode === "scholar-qa" || viewMode === "all-feeds" || viewMode === "paper-reproduction" || viewMode === "idea-discovery" || viewMode === "fudan-collection-search") && (
          <LeftSidebar
            onNavigate={(view) => setViewMode(view as any)}
            onOpenInvite={() => setShowInviteModal(true)}
            onOpenPaywall={() => setShowPaywallModal(true)}
            onOpenRecharge={() => setShowRechargeModal(true)}
            onOpenNotifications={() => setShowNotificationDrawer(true)}
            onNewScholarQA={handleResetScholarQA}
            onResetSearch={handleResetSearch}
            currentView={viewMode}
          />
        )}

        {/* Main Content */}
        <div className={isReaderView ? "flex-1 flex flex-col min-w-0 overflow-hidden" : "flex-1 flex flex-col min-w-0"}>
          {viewMode === "home" ? (
            // Show HomePage
            <HomePage
              onNavigateToWorkspace={() => setViewMode("all-feeds")}
              onNavigate={(view) => setViewMode(view as any)}
              onOpenPricing={() => setShowPaywallModal(true)}
              onOpenRecharge={() => setShowRechargeModal(true)}
              onStartSearch={handleStartSearchFromHome}
            />
          ) : viewMode === "fudan-collection-search" ? (
            !hasSearched ? (
              <ScholarSearchHome
                onSearch={handleSearch}
                showDeepSearchTooltip={showDeepSearchTooltip}
                onTooltipDismiss={() => setShowDeepSearchTooltip(false)}
              />
            ) : (
              <FudanCollectionResults
                papers={filteredPapers}
                searchQuery={searchQuery}
                onSearchChange={(query) => {
                  setSearchQuery(query);
                  setHasSearched(Boolean(query.trim()));
                }}
              />
            )
          ) : viewMode === "list" ? (
            !hasSearched ? (
              // Show Scholar Search Home when no search has been performed
              <ScholarSearchHome 
                onSearch={handleSearch}
                showDeepSearchTooltip={showDeepSearchTooltip}
                onTooltipDismiss={() => setShowDeepSearchTooltip(false)}
              />
            ) : (
              // Show search results
              <>
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                  <SearchBar
                    value={searchQuery}
                    onChange={handleSearchChange}
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </div>

                <SearchThinkingPanel query={searchQuery} />

                <div className="flex-1 overflow-hidden">
                  <SearchResults
                    papers={filteredPapers}
                    books={mockBooks}
                    theses={mockTheses}
                    selectedPaper={selectedPaper}
                    onSelectPaper={handleSelectPaper}
                    searchQuery={searchQuery}
                  />
                </div>
              </>
            )
          ) : viewMode === "library" ? (
            <MyLibrary
              papers={mockPapers}
              onPaperClick={handleSelectPaper}
            />
          ) : viewMode === "scholar-qa" ? (
            <ScholarQA key={scholarQAKey} papersCount={mockPapers.length} onReset={handleResetScholarQA} />
          ) : viewMode === "all-feeds" ? (
            <AllFeedsWorkspace />
          ) : viewMode === "paper-reproduction" ? (
            <PaperReproduction />
          ) : viewMode === "idea-discovery" ? (
            <IdeaDiscovery />
          ) : (
            <PaperDetail
              paper={selectedPaper!}
              onBack={handleBackToList}
            />
          )}
        </div>

        {/* Right Panel - Only show in list view with search results */}
        {viewMode === "list" && hasSearched && (
          <RightPanel selectedPaper={selectedPaper} />
        )}

        {/* Search More Button - Show only in list view with search results */}
        {viewMode === "list" && hasSearched && filteredPapers.length > 0 && (
          <SearchMoreButton onSearchMore={handleSearchMore} isLoading={isLoadingMore} />
        )}

        {/* Floating Task Button - Show in list, library, and scholar-qa views */}
        {(viewMode === "list" || viewMode === "library" || viewMode === "scholar-qa") && (
          <FloatingTaskButton onClick={() => setShowTasksModal(true)} />
        )}

        {/* Newbie Tasks Modal */}
        <NewbieTasksModal 
          isOpen={showTasksModal}
          onClose={() => setShowTasksModal(false)}
          onNavigate={(view) => {
            setViewMode(view as any);
          }}
          onOpenInvite={() => {
            setShowTasksModal(false);
            setShowInviteModal(true);
          }}
          onTriggerDeepSearchTooltip={() => {
            setShowDeepSearchTooltip(true);
          }}
        />

        {/* Invite Modal */}
        <InviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
        />

        {/* Paywall Modal */}
        <PaywallModal
          isOpen={showPaywallModal}
          onClose={() => setShowPaywallModal(false)}
        />

        {/* Recharge Modal */}
        <RechargeModal
          isOpen={showRechargeModal}
          onClose={() => setShowRechargeModal(false)}
        />

        {/* Notification Drawer */}
        <NotificationDrawer
          isOpen={showNotificationDrawer}
          onClose={() => setShowNotificationDrawer(false)}
        />
      </div>
    </LanguageProvider>
  );
}
