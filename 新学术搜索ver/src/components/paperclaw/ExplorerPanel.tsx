import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronDown, FileText, Database, FlaskConical, FolderOpen, Folder, File, Download, Trash2, MoreVertical, Upload, Plus } from 'lucide-react';

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon?: React.ReactNode;
  children?: TreeNode[];
  size?: string;
  date?: string;
}

interface ExplorerPanelProps {}

export function ExplorerPanel({}: ExplorerPanelProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['papers', 'datasets', 'experiments']));
  const [selectedItem, setSelectedItem] = useState<string | null>('paper-1');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<TreeNode[]>([]);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const processFiles = (files: FileList | File[]) => {
    const newNodes: TreeNode[] = Array.from(files).map((file, idx) => ({
      id: `uploaded-${Date.now()}-${idx}`,
      name: file.name,
      type: 'file' as const,
      size: formatFileSize(file.size),
      date: new Date().toISOString().split('T')[0],
    }));
    setUploadedFiles(prev => [...prev, ...newNodes]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set false if we're leaving the container (not entering a child)
    const rect = e.currentTarget.getBoundingClientRect();
    const { clientX, clientY } = e;
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      setIsDraggingFile(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleUploadSource = (source: 'local' | 'google-drive' | 'baidu-drive') => {
    setShowUploadMenu(false);

    if (source === 'local') {
      uploadInputRef.current?.click();
      return;
    }

    const name = source === 'google-drive'
      ? 'Google Drive 导入文件.pdf'
      : '百度网盘导入文件.pdf';

    setUploadedFiles((prev) => [
      ...prev,
      {
        id: `imported-${source}-${Date.now()}`,
        name,
        type: 'file',
        size: 'Mock',
        date: new Date().toISOString().split('T')[0],
      },
    ]);
    setExpandedFolders((prev) => new Set(prev).add('uploads'));
  };

  const handleRemoveUploaded = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  // Mock data structure
  const treeData: TreeNode[] = [
    {
      id: 'papers',
      name: 'Papers',
      type: 'folder',
      icon: <FileText className="w-4 h-4" />,
      children: [
        {
          id: 'paper-1',
          name: 'Attention Is All You Need.pdf',
          type: 'file',
          size: '2.3 MB',
          date: '2024-03-01'
        },
        {
          id: 'paper-2',
          name: 'BERT Pre-training.pdf',
          type: 'file',
          size: '1.8 MB',
          date: '2024-03-02'
        },
        {
          id: 'paper-3',
          name: 'GPT-3 Language Models.pdf',
          type: 'file',
          size: '3.1 MB',
          date: '2024-02-28'
        }
      ]
    },
    {
      id: 'datasets',
      name: 'Datasets',
      type: 'folder',
      icon: <Database className="w-4 h-4" />,
      children: [
        {
          id: 'dataset-1',
          name: 'WMT 2014 English-German',
          type: 'folder',
          children: [
            {
              id: 'train-data',
              name: 'train.txt',
              type: 'file',
              size: '450 MB',
              date: '2024-03-01'
            },
            {
              id: 'valid-data',
              name: 'valid.txt',
              type: 'file',
              size: '12 MB',
              date: '2024-03-01'
            },
            {
              id: 'test-data',
              name: 'test.txt',
              type: 'file',
              size: '8 MB',
              date: '2024-03-01'
            }
          ]
        },
        {
          id: 'dataset-2',
          name: 'ImageNet-1K',
          type: 'folder',
          children: [
            {
              id: 'imagenet-train',
              name: 'train/',
              type: 'folder',
              size: '150 GB',
              date: '2024-02-28'
            },
            {
              id: 'imagenet-val',
              name: 'val/',
              type: 'folder',
              size: '6.3 GB',
              date: '2024-02-28'
            }
          ]
        }
      ]
    },
    {
      id: 'experiments',
      name: 'Experiments',
      type: 'folder',
      icon: <FlaskConical className="w-4 h-4" />,
      children: [
        {
          id: 'exp-1',
          name: 'transformer_base_2024-03-01',
          type: 'folder',
          children: [
            {
              id: 'exp-1-config',
              name: 'config.json',
              type: 'file',
              size: '2 KB',
              date: '2024-03-01'
            },
            {
              id: 'exp-1-checkpoint',
              name: 'checkpoint_best.pt',
              type: 'file',
              size: '512 MB',
              date: '2024-03-01'
            },
            {
              id: 'exp-1-log',
              name: 'training.log',
              type: 'file',
              size: '1.2 MB',
              date: '2024-03-01'
            }
          ]
        },
        {
          id: 'exp-2',
          name: 'transformer_large_2024-02-28',
          type: 'folder',
          children: [
            {
              id: 'exp-2-config',
              name: 'config.json',
              type: 'file',
              size: '2 KB',
              date: '2024-02-28'
            }
          ]
        }
      ]
    }
  ];

  const renderTree = (nodes: TreeNode[], depth = 0) => {
    return nodes.map(node => {
      const isExpanded = expandedFolders.has(node.id);
      const isSelected = selectedItem === node.id;
      const hasChildren = node.children && node.children.length > 0;

      return (
        <div key={node.id}>
          <div
            onClick={() => {
              if (node.type === 'folder') {
                toggleFolder(node.id);
              }
              setSelectedItem(node.id);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer group transition-colors ${
              isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
            style={{ paddingLeft: `${depth * 16 + 12}px` }}
          >
            {/* Expand/Collapse Icon */}
            {node.type === 'folder' && hasChildren && (
              <span className="flex-shrink-0">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </span>
            )}
            {node.type === 'folder' && !hasChildren && (
              <span className="w-4" />
            )}

            {/* Icon */}
            <span className={`flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
              {node.icon || (
                node.type === 'folder' ? (
                  isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />
                ) : (
                  <File className="w-4 h-4" />
                )
              )}
            </span>

            {/* Name */}
            <span className={`flex-1 text-sm truncate ${isSelected ? 'font-medium text-blue-900' : 'text-gray-900'}`}>
              {node.name}
            </span>

            {/* Actions */}
            {node.type === 'file' && (
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('More actions for', node.name);
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
            )}
          </div>

          {/* Children */}
          {node.type === 'folder' && hasChildren && isExpanded && (
            <div>
              {renderTree(node.children!, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">资源管理器</h2>
      </div>

      {/* Tree View */}
      <div
        className={`flex-1 overflow-y-auto py-2 relative transition-colors ${isDraggingFile ? 'bg-blue-50/50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {/* Hidden file input */}
        <input
          type="file"
          ref={uploadInputRef}
          className="hidden"
          multiple
          onChange={handleFileInputChange}
        />

        {/* Drag overlay */}
        {isDraggingFile && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-blue-50/80 border-2 border-dashed border-blue-400 rounded-lg m-2 pointer-events-none">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs text-blue-700" style={{ fontWeight: 600 }}>拖放文件到此处上传</p>
            </div>
          </div>
        )}

        {renderTree(treeData)}

        {/* Uploaded Files Section */}
        {uploadedFiles.length > 0 && (
          <div className="mt-1">
            <div
              className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors"
              style={{ paddingLeft: '12px' }}
              onClick={() => toggleFolder('uploads')}
            >
              <span className="flex-shrink-0">
                {expandedFolders.has('uploads') ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </span>
              <span className="flex-shrink-0 text-blue-600">
                <Upload className="w-4 h-4" />
              </span>
              <span className="flex-1 text-sm text-gray-900" style={{ fontWeight: 500 }}>
                Uploads
              </span>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                {uploadedFiles.length}
              </span>
            </div>
            {expandedFolders.has('uploads') && uploadedFiles.map(file => (
              <div
                key={file.id}
                onClick={() => setSelectedItem(file.id)}
                className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer group transition-colors ${
                  selectedItem === file.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                style={{ paddingLeft: '28px' }}
              >
                <span className={`flex-shrink-0 ${selectedItem === file.id ? 'text-blue-600' : 'text-gray-600'}`}>
                  <File className="w-4 h-4" />
                </span>
                <span className={`flex-1 text-sm truncate ${selectedItem === file.id ? 'font-medium text-blue-900' : 'text-gray-900'}`}>
                  {file.name}
                </span>
                <div className="flex-shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveUploaded(file.id);
                    }}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        <div className="relative px-3 pt-3 pb-1">
          <button
            onClick={() => setShowUploadMenu((prev) => !prev)}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            上传文件
          </button>
          {showUploadMenu ? (
            <div className="absolute left-3 right-3 bottom-full mb-2 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-xs shadow-lg z-20">
              <button
                type="button"
                onClick={() => handleUploadSource('local')}
                className="block w-full px-3 py-2.5 text-left text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-950"
              >
                添加本地文件
              </button>
              <button
                type="button"
                onClick={() => handleUploadSource('google-drive')}
                className="block w-full px-3 py-2.5 text-left text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-950"
              >
                从 Google Drive 导入
              </button>
              <button
                type="button"
                onClick={() => handleUploadSource('baidu-drive')}
                className="block w-full px-3 py-2.5 text-left text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-950"
              >
                从百度网盘导入
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* File Info Panel (when file is selected) */}
      {selectedItem && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-xs space-y-2">
            {(() => {
              // Find selected node
              const findNode = (nodes: TreeNode[]): TreeNode | null => {
                for (const node of nodes) {
                  if (node.id === selectedItem) return node;
                  if (node.children) {
                    const found = findNode(node.children);
                    if (found) return found;
                  }
                }
                return null;
              };
              const selectedNode = findNode(treeData);
              
              if (!selectedNode || selectedNode.type === 'folder') {
                // Also check uploaded files
                const uploadedNode = uploadedFiles.find(f => f.id === selectedItem);
                if (!uploadedNode) return null;
                return (
                  <>
                    <div>
                      <p className="text-gray-500">文件名</p>
                      <p className="text-gray-900 font-medium truncate">{uploadedNode.name}</p>
                    </div>
                    {uploadedNode.size && (
                      <div>
                        <p className="text-gray-500">大小</p>
                        <p className="text-gray-900">{uploadedNode.size}</p>
                      </div>
                    )}
                    {uploadedNode.date && (
                      <div>
                        <p className="text-gray-500">上传时间</p>
                        <p className="text-gray-900">{uploadedNode.date}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors">
                        <Download className="w-3.5 h-3.5" />
                        下载
                      </button>
                      <button
                        onClick={() => handleRemoveUploaded(uploadedNode.id)}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                );
              }

              return (
                <>
                  <div>
                    <p className="text-gray-500">文件名</p>
                    <p className="text-gray-900 font-medium truncate">{selectedNode.name}</p>
                  </div>
                  {selectedNode.size && (
                    <div>
                      <p className="text-gray-500">大小</p>
                      <p className="text-gray-900">{selectedNode.size}</p>
                    </div>
                  )}
                  {selectedNode.date && (
                    <div>
                      <p className="text-gray-500">修改时间</p>
                      <p className="text-gray-900">{selectedNode.date}</p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors">
                      <Download className="w-3.5 h-3.5" />
                      下载
                    </button>
                    <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
