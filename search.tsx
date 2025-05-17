
import React, { useState, useEffect } from 'react';
import { Win95Window } from '@/components/ui/win95-window';
import { Win95Button } from '@/components/ui/win95-button';
import { Search } from 'lucide-react';
import { useP2P } from '../context/P2PContext';
import { toast } from '@/hooks/use-toast';

interface DiscoveredPeer {
  id: string;
  name: string;
  peerId: string;
  isOnline: boolean;
  lastSeen?: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DiscoveredPeer[]>([]);
  const [trendingPeers, setTrendingPeers] = useState<DiscoveredPeer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { connect, discoverPeers } = useP2P();
  
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setResults([]);
    
    try {
      const discoveredPeerIds = await discoverPeers();
      
      // Create user-friendly results from the peer IDs
      const searchResults = discoveredPeerIds.map((peerId, index) => ({
        id: `search-${index}`,
        name: `User-${peerId.substring(0, 6)}`,
        peerId,
        isOnline: true, // Active discovery typically finds online peers
        lastSeen: Date.now()
      }));
      
      // Filter results by the search query (username contains query)
      const filteredResults = searchResults.filter(
        user => user.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search Failed',
        description: 'Unable to complete search request',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleConnect = async (peerId: string) => {
    toast({
      title: 'Connecting',
      description: `Attempting to connect to ${peerId.substring(0, 8)}...`,
    });
    
    const success = await connect(peerId);
    
    if (success) {
      toast({
        title: 'Connected',
        description: 'Successfully connected to peer',
      });
    } else {
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to peer',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="p-4">
      <Win95Window title="Search" className="max-w-lg mx-auto h-[calc(100vh-130px)]">
        <div className="space-y-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              className="win95-inset flex-1 px-2 py-1.5 text-sm"
              placeholder="Search users, posts, or peers..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Win95Button onClick={handleSearch} disabled={isSearching}>
              <Search size={16} />
            </Win95Button>
          </div>
          
          {isSearching ? (
            <div className="win95-inset p-4 text-center">
              Searching the P2P network...
            </div>
          ) : results.length > 0 ? (
            <div className="win95-inset p-2">
              <h3 className="text-sm font-bold mb-2">Results</h3>
              <div className="space-y-2">
                {results.map(result => (
                  <div key={result.id} className="bg-white shadow-win95-in p-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{result.name}</span>
                      <span className={`text-xs ${result.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                        {result.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 font-mono mt-1 break-all">{result.peerId}</div>
                    <div className="mt-2">
                      <Win95Button size="sm" onClick={() => handleConnect(result.peerId)}>Connect</Win95Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : query && (
            <div className="win95-inset p-4 text-center">
              No results found in the P2P network
            </div>
          )}
          
          {trendingPeers.length > 0 && (
            <div className="win95-inset p-2">
              <h3 className="text-sm font-bold mb-2">Trending Peers</h3>
              <div className="space-y-2">
                {trendingPeers.map(peer => (
                  <div key={peer.id} className="bg-white shadow-win95-in p-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{peer.name}</span>
                      <span className={`text-xs ${peer.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                        {peer.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-500">ID: {peer.peerId.substring(0, 10)}...</span>
                      <Win95Button size="sm" onClick={() => handleConnect(peer.peerId)}>Connect</Win95Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="p-2 text-xs text-center text-gray-500">
            TeleMesh uses secure peer-to-peer connections.<br/>
            No centralized servers store your data.
          </div>
        </div>
      </Win95Window>
    </div>
  );
}
