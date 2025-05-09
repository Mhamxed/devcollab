import { useState, useEffect } from 'react';
import { Copy, Check, X } from 'lucide-react';

export default function InviteModal({ sessioId, isOpen, setIsOpen }: { sessioId: string | undefined, isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
      const [copied, setCopied] = useState(false);
      const [inviteLink, setInviteLink] = useState('');
    
      // Generate a random invite link when the modal opens
      useEffect(() => {
        if (isOpen) {
          setInviteLink(`http://localhost:5173/sessions/${sessioId}`);
        }
      }, [isOpen, sessioId]);
    
      const handleCopyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      };
    
      if (!isOpen) {
        return (
          <div className="flex items-center justify-center p-4">
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Generate Invite Link
            </button>
          </div>
        );
      }
    
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {/* ↑ This creates a semi-transparent black overlay covering the entire screen */}
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-medium">Invite Friends</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="mb-4 text-gray-600">
                Share this link with friends to invite them to your workspace.
              </p>
              
              <div className="flex items-center">
                <div className="flex-1 bg-gray-100 p-3 rounded-l-md overflow-hidden whitespace-nowrap overflow-ellipsis">
                  {inviteLink}
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`p-3 flex items-center justify-center rounded-r-md ${
                    copied ? 'bg-green-500' : 'bg-blue-600'
                  } text-white min-w-[64px]`}
                  aria-label="Copy invite link"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              
              {copied && (
                <p className="mt-2 text-sm text-green-600">
                  Link copied to clipboard!
                </p>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-b-lg flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }