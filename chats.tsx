import React, { useState, useEffect } from 'react';
import { Win95Window } from '@/components/ui/win95-window';
import { Win95Button } from '@/components/ui/win95-button';
import { formatDate } from '@/lib/utils';
import { useP2P } from '../context/P2PContext';
import { toast } from '@/hooks/use-toast';

interface Chat {
  id: string;
  name: string;
  peerId: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isMe: boolean;
}

export default function ChatsPage() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  
  const { status, sendMessage } = useP2P();

  useEffect(() => {
    const messageHandler = (data: any) => {
      if (data.type === 'chat') {
        const { sender, content } = data;
        const chatId = `chat-${sender}`;
        
        setMessages(prev => ({
          ...prev,
          [chatId]: [
            ...(prev[chatId] || []),
            {
              id: `msg-${Date.now()}`,
              sender: data.senderName || sender.substring(0, 8),
              content,
              timestamp: new Date(),
              isMe: false
            }
          ]
        }));

        setChats(prev => {
          const existingChatIndex = prev.findIndex(c => c.peerId === sender);
          if (existingChatIndex >= 0) {
            return prev.map((chat, index) => 
              index === existingChatIndex ? {
                ...chat,
                lastMessage: content,
                timestamp: new Date(),
                unread: activeChat === chatId ? 0 : chat.unread + 1
              } : chat
            );
          }
          return [{
            id: chatId,
            name: data.senderName || `User-${sender.substring(0, 6)}`,
            peerId: sender,
            lastMessage: content,
            timestamp: new Date(),
            unread: 1
          }, ...prev];
        });

        toast({
          title: `Message from ${data.senderName || sender.substring(0, 8)}`,
          description: content.length > 30 
            ? `${content.substring(0, 30)}...` 
            : content,
        });
      }
    };

    // Implement proper subscription in your P2P context
    const unsubscribe = messageHandler; // Replace with actual subscription

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [activeChat]);

  const handleSend = () => {
    if (!inputText.trim() || !activeChat) return;
    
    const currentChat = chats.find(c => c.id === activeChat);
    if (!currentChat) return;

    try {
      const success = sendMessage('chat', {
        content: inputText,
        senderName: localStorage.getItem('username') || 'User'
      }, currentChat.peerId);

      if (success) {
        setMessages(prev => ({
          ...prev,
          [activeChat]: [
            ...(prev[activeChat] || []),
            {
              id: `msg-${Date.now()}`,
              sender: 'You',
              content: inputText,
              timestamp: new Date(),
              isMe: true
            }
          ]
        }));

        setChats(prev => 
          prev.map(chat => 
            chat.id === activeChat ? {
              ...chat,
              lastMessage: inputText,
              timestamp: new Date()
            } : chat
          )
        );
        
        setInputText('');
      }
    } catch (error) {
      toast({
        title: 'Message Failed',
        description: 'Could not send message. Check connection.',
        variant: 'destructive',
      });
    }
  };

  const handleChatOpen = (chatId: string) => {
    setActiveChat(chatId);
    setChats(prev => 
      prev.map(chat => 
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
  };

  return (
    <div className="p-4 h-screen">
      {!activeChat ? (
        <Win95Window title="Chats" className="h-full">
          <div className="p-2 space-y-2">
            {status.status !== 'connected' && (
              <div className="text-red-500 mb-2">
                Not connected to P2P network. Your messages will only be delivered when connected.
              </div>
            )}

            {chats.length === 0 ? (
              <div className="text-center py-4">
                <p>No chats yet.</p>
                <p>Connect to peers to start chatting.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {chats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatOpen(chat.id)}
                    className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer border-b"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-bold">{chat.name}</span>
                        <span className="text-sm">{formatDate(chat.timestamp)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="truncate">{chat.lastMessage}</span>
                        {chat.unread > 0 && (
                          <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                            {chat.unread} new
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {chats.length > 0 && status.connectedPeers === 0 && (
              <div className="text-yellow-600 mt-2">
                You are currently offline. Messages will be sent when you reconnect.
              </div>
            )}
          </div>
        </Win95Window>
      ) : (
        <Win95Window 
          title={chats.find(c => c.id === activeChat)?.name || 'Chat'}
          className="h-full"
          onClose={() => setActiveChat(null)}
        >
          <div className="flex flex-col h-[calc(100%-40px)]">
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {(messages[activeChat] || []).length === 0 ? (
                <div className="text-center py-4">No messages yet. Start the conversation!</div>
              ) : (
                (messages[activeChat] || []).map(message => (
                  <div
                    key={message.id}
                    className={`p-2 rounded ${message.isMe ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}
                    style={{ maxWidth: '80%' }}
                  >
                    <div className="text-sm font-medium">{message.sender}</div>
                    <div>{message.content}</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(message.timestamp)}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="border-t p-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="win95-input flex-1"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <Win95Button onClick={handleSend}>
                  Send
                </Win95Button>
              </div>
            </div>
          </div>
        </Win95Window>
      )}
    </div>
  );
}

