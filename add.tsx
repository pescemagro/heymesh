
import React, { useState, useEffect } from 'react';
import { Win95Window } from '@/components/ui/win95-window';
import { Win95Button } from '@/components/ui/win95-button';
import { useP2P } from '../context/P2PContext';
import { toast } from '@/hooks/use-toast';

export default function AddPage() {
  const [message, setMessage] = useState('');
  const [peerId, setPeerId] = useState('');
  const [discoveredPeers, setDiscoveredPeers] = useState<string[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const { connect, status, sendMessage, discoverPeers, generatedPeerId } = useP2P();
  const [result, setResult] = useState<string | null>(null);
  
  const handleConnect = async () => {
    if (!peerId.trim()) {
      setResult('Please enter a Peer ID');
      return;
    }
    
    setResult('Connecting...');
    const success = await connect(peerId.trim());
    setResult(success ? 'Connected successfully!' : 'Connection failed');
  };
  
  const handleBroadcast = () => {
    if (!message.trim()) {
      setResult('Please enter a message');
      return;
    }
    
    const success = sendMessage('broadcast', message);
    if (success) {
      setResult('Message sent!');
      setMessage(''); // Clear the message field after sending
    } else {
      setResult('Failed to send message');
    }
  };
  
  const handleDiscoverPeers = async () => {
    setIsDiscovering(true);
    try {
      const peers = await discoverPeers();
      setDiscoveredPeers(peers);
    } catch (error) {
      toast({
        title: "Discovery Failed",
        description: "Failed to discover peers",
        variant: "destructive",
      });
    } finally {
      setIsDiscovering(false);
    }
  };

  // Copy peer ID to clipboard
  const copyPeerId = () => {
    if (status.peerId) {
      navigator.clipboard.writeText(status.peerId)
        .then(() => {
          toast({
            title: "Copied!",
            description: "Peer ID copied to clipboard",
          });
        })
        .catch(() => {
          toast({
            title: "Failed",
            description: "Could not copy to clipboard",
            variant: "destructive",
          });
        });
    }
  };
  
  return (
    <div className="p-4">
      <Win95Window title="Add" className="max-w-lg mx-auto h-[calc(100vh-130px)]">
        <div className="space-y-4">
          <div className="win95-inset p-4">
            <h2 className="text-base font-bold mb-2">Create Post</h2>
            <textarea 
              className="win95-inset w-full h-32 p-2 text-sm mb-2"
              placeholder="What's on your mind?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end">
              <Win95Button onClick={handleBroadcast}>Post</Win95Button>
            </div>
          </div>
          
          <div className="win95-inset p-4">
            <h2 className="text-base font-bold mb-2">Connect to Peer</h2>
            <input 
              type="text" 
              className="win95-inset w-full p-2 text-sm mb-2"
              placeholder="Peer ID"
              value={peerId}
              onChange={(e) => setPeerId(e.target.value)}
            />
            <div className="flex justify-end">
              <Win95Button onClick={handleConnect}>Connect</Win95Button>
            </div>
          </div>

          <div className="win95-inset p-4">
            <h2 className="text-base font-bold mb-2">Discover Peers</h2>
            <div className="flex justify-end mb-2">
              <Win95Button 
                onClick={handleDiscoverPeers} 
                disabled={isDiscovering}
              >
                {isDiscovering ? 'Discovering...' : 'Find Peers'}
              </Win95Button>
            </div>
            
            {discoveredPeers.length > 0 && (
              <div className="mt-2 space-y-2">
                <h3 className="text-sm font-bold">Found Peers:</h3>
                {discoveredPeers.map((peer, index) => (
                  <div key={index} className="shadow-win95-in p-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs">{peer.substring(0, 16)}...</span>
                      <Win95Button 
                        size="sm" 
                        onClick={() => {
                          setPeerId(peer);
                          toast({
                            title: "Peer ID Set",
                            description: "Peer ID added to connection field",
                          });
                        }}
                      >
                        Select
                      </Win95Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {result && (
            <div className={`p-2 text-sm ${result.includes('failed') ? 'bg-red-100' : 'bg-green-100'}`}>
              {result}
            </div>
          )}
          
          <div className="shadow-win95-in p-2">
            <p className="text-sm mb-2">Connection Status: 
              <span className={`ml-1 ${status.status === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                {status.status}
              </span>
            </p>
            {status.peerId && (
              <div className="flex items-center justify-between">
                <p className="text-sm font-mono break-all">Your Peer ID: {status.peerId}</p>
                <Win95Button size="sm" onClick={copyPeerId}>Copy</Win95Button>
              </div>
            )}
            <p className="text-sm mt-1">Connected Peers: {status.connectedPeers}</p>
          </div>
        </div>
      </Win95Window>
    </div>
  );
}
