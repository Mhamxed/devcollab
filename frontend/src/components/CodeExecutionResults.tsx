import { useState } from 'react';
import { Copy, Check, XCircle, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
type ResultStatus = 'success' | 'error' | 'warning' | 'loading' | 'idle';

interface CodeExecutionResultsProps {
    isExecutionResultOpen: boolean;
    setIsExecutionResultOpen: (isExecutionResultOpen: boolean) => void;
    output: string;
    status: ResultStatus;
}
export default function CodeExecutionResults({ isExecutionResultOpen, setIsExecutionResultOpen, output, status }: CodeExecutionResultsProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle size={16} className="text-green-800" />;
      case 'error':
        return <XCircle size={16} className="text-red-500" />;
      case 'warning':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'loading':
        return <RefreshCw size={16} className="text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'border-green-800';
      case 'error': return 'border-red-500';
      case 'warning': return 'border-yellow-500';
      case 'loading': return 'border-blue-500';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-4 fixed bottom-0 left-0">
      <div className={`bg-white ${getStatusColor()} overflow-hidden rounded-tr-xl`}>
        <div className="bg-white px-4 py-2 flex justify-between items-center border-b-1 border-gray-200">
          <div className="flex items-center">
            <div className='flex items-center gap-2'>
                <span className="font-mono text-sm text-black">Execution Results</span>
                {renderStatusIcon()}
            </div>
          </div>
          {!isExecutionResultOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" 
                onClick={() => setIsExecutionResultOpen(!isExecutionResultOpen)}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              onClick={() => setIsExecutionResultOpen(!isExecutionResultOpen)}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            )}
        </div>
        {isExecutionResultOpen && <div className="flex flex-col p-4 min-h-40 max-h-64 overflow-auto">
            {output && (
                <div className="flex items-center justify-end">
                    <button
                        onClick={handleCopyOutput}
                        className="flex items-center space-x-1 px-2 py-1 rounded text-black hover:bg-gray-50"
                        >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>

                </div>
          )}
          {status === 'idle' && (
            <div className="text-black font-mono text-sm">Run your code to see results here</div>
          )}
          {status === 'loading' && (
            <div className="flex items-center space-x-2 text-blue-400 font-mono text-sm">
              <RefreshCw size={14} className="animate-spin" />
              <span>Executing code...</span>
            </div>
          )}
          {(status === 'success' || status === 'error' || status === 'warning') && (
            <pre className={`font-mono text-sm whitespace-pre-wrap ${
              status === 'error' ? 'text-red-400' : 
              status === 'warning' ? 'text-yellow-300' : 
              'text-green-800'
            }`}>
              {output}
            </pre>
          )}
        </div>}
      </div>
    </div>
  );
}