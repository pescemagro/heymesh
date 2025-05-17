
import React from 'react';
import { Win95Window } from '@/components/ui/win95-window';
import { formatDate } from '@/lib/utils';
import { useP2P } from '@/context/P2PContext';

export default function TimelinePage() {
  const { status } = useP2P();
  const [posts, setPosts] = React.useState<Array<{
    id: string;
    author: string;
    content: string;
    timestamp: Date;
    likes: number;
  }>>([]);

  return (
    <div className="p-4">
      <Win95Window title="Stream" className="max-w-lg mx-auto mb-4 h-[calc(100vh-130px)]">
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="bg-white shadow-win95-in p-2">
                <div className="flex justify-between">
                  <span className="font-bold">{post.author}</span>
                  <span className="text-xs text-gray-600">{formatDate(post.timestamp)}</span>
                </div>
                <p className="my-2">{post.content}</p>
                <div className="flex justify-between text-sm">
                  <button className="win95-button text-xs">Like ({post.likes})</button>
                  <button className="win95-button text-xs">Reply</button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center">
              <p className="mb-2">Welcome to TeleMesh!</p>
              <p className="text-sm text-gray-600">Connect with peers to see their posts in your timeline.</p>
              {status.connectedPeers === 0 && (
                <p className="mt-4 text-xs">
                  You are not connected to any peers yet. Visit the Search page to find and connect with peers.
                </p>
              )}
            </div>
          )}
        </div>
      </Win95Window>
    </div>
  );
}
