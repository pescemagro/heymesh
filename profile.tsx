
import React, { useState, useEffect } from 'react';
import { Win95Window } from '@/components/ui/win95-window';
import { Win95Button } from '@/components/ui/win95-button';
import { useP2P } from '../context/P2PContext';
import { toast } from '@/hooks/use-toast';

interface ProfileData {
  username: string;
  bio: string;
  avatarColor: string;
  securityOptions: {
    autoConnect: boolean;
    discoverable: boolean;
    encryptMessages: boolean;
  };
}

const DEFAULT_PROFILE: ProfileData = {
  username: 'User',
  bio: 'TeleMesh P2P user',
  avatarColor: '#DF93C3',
  securityOptions: {
    autoConnect: false,
    discoverable: true,
    encryptMessages: true,
  }
};

export default function ProfilePage() {
  const { status, regeneratePeerId, generatedPeerId } = useP2P();
  const [profile, setProfile] = useState<ProfileData>(() => {
    const savedProfile = localStorage.getItem('profile');
    return savedProfile ? JSON.parse(savedProfile) : DEFAULT_PROFILE;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<ProfileData>(profile);
  
  const handleSave = () => {
    // Validate username
    if (!editedProfile.username.trim()) {
      toast({
        title: "Invalid Username",
        description: "Username cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setProfile(editedProfile);
    localStorage.setItem('profile', JSON.stringify(editedProfile));
    localStorage.setItem('username', editedProfile.username);
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved",
    });
  };

  const handleRegeneratePeerId = () => {
    if (window.confirm("This will disconnect you from all peers and create a new identity. Are you sure?")) {
      regeneratePeerId();
      toast({
        title: "Security Update",
        description: "Your peer ID has been regenerated",
      });
    }
  };
  
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

  // Save username to localStorage on initial load for P2P metadata
  useEffect(() => {
    localStorage.setItem('username', profile.username);
  }, []);
  
  return (
    <div className="p-4">
      <Win95Window title="Info.exe" className="max-w-lg mx-auto h-[calc(100vh-130px)]">
        <div className="space-y-4">
          {isEditing ? (
            <div className="win95-inset p-4">
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Username</label>
                <input 
                  type="text" 
                  className="win95-inset w-full p-2 text-sm"
                  value={editedProfile.username}
                  onChange={(e) => setEditedProfile({...editedProfile, username: e.target.value})}
                  maxLength={20}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Bio</label>
                <textarea 
                  className="win95-inset w-full p-2 text-sm h-24"
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                  maxLength={160}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Avatar Color</label>
                <div className="flex gap-2">
                  {['#DF93C3', '#9370DB', '#20B2AA', '#FF6347', '#4682B4'].map(color => (
                    <div 
                      key={color}
                      className={`w-8 h-8 cursor-pointer ${editedProfile.avatarColor === color ? 'ring-2 ring-black' : ''}`}
                      style={{backgroundColor: color}}
                      onClick={() => setEditedProfile({...editedProfile, avatarColor: color})}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Security Options</label>
                
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="autoConnect"
                    className="win95-checkbox mr-2"
                    checked={editedProfile.securityOptions.autoConnect}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile,
                      securityOptions: {
                        ...editedProfile.securityOptions,
                        autoConnect: e.target.checked
                      }
                    })}
                  />
                  <label htmlFor="autoConnect" className="text-sm">Auto-connect to known peers</label>
                </div>
                
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="discoverable"
                    className="win95-checkbox mr-2"
                    checked={editedProfile.securityOptions.discoverable}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile,
                      securityOptions: {
                        ...editedProfile.securityOptions,
                        discoverable: e.target.checked
                      }
                    })}
                  />
                  <label htmlFor="discoverable" className="text-sm">Make profile discoverable</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="encryptMessages"
                    className="win95-checkbox mr-2"
                    checked={editedProfile.securityOptions.encryptMessages}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile,
                      securityOptions: {
                        ...editedProfile.securityOptions,
                        encryptMessages: e.target.checked
                      }
                    })}
                  />
                  <label htmlFor="encryptMessages" className="text-sm">Encrypt messages (recommended)</label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Win95Button onClick={() => setIsEditing(false)}>Cancel</Win95Button>
                <Win95Button variant="primary" onClick={handleSave}>Save</Win95Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 p-2">
                <div 
                  className="w-16 h-16 flex items-center justify-center text-white text-2xl font-bold"
                  style={{backgroundColor: profile.avatarColor}}
                >
                  {profile.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{profile.username}</h2>
                  <p className="text-sm text-gray-700">{profile.bio}</p>
                </div>
              </div>
              
              <div className="win95-inset p-2">
                <h3 className="text-sm font-bold mb-1">P2P Network Status</h3>
                <p className="text-sm">Status: 
                  <span className={`ml-1 ${status.status === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                    {status.status}
                  </span>
                </p>
                {status.peerId && (
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm break-all mr-2">Your ID: {status.peerId}</p>
                    <Win95Button size="sm" onClick={copyPeerId}>Copy</Win95Button>
                  </div>
                )}
                <p className="text-sm mt-1">Connected Peers: {status.connectedPeers}</p>
              </div>
              
              <div className="win95-inset p-2">
                <h3 className="text-sm font-bold mb-1">Security Options</h3>
                <div className="text-sm space-y-1">
                  <p>Auto-connect: {profile.securityOptions.autoConnect ? 'On' : 'Off'}</p>
                  <p>Discoverable: {profile.securityOptions.discoverable ? 'On' : 'Off'}</p>
                  <p>Message Encryption: {profile.securityOptions.encryptMessages ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div className="mt-2">
                  <Win95Button 
                    size="sm" 
                    onClick={handleRegeneratePeerId}
                    className="w-full"
                  >
                    Regenerate Secure ID
                  </Win95Button>
                  <p className="text-xs text-gray-500 mt-1">For improved privacy and security</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Win95Button onClick={() => setIsEditing(true)}>Edit Profile</Win95Button>
              </div>
            </>
          )}
          
          <div className="win95-inset p-2">
            <h3 className="text-sm font-bold mb-1">About TeleMesh P2P</h3>
            <p className="text-xs">Version 1.0.0</p>
            <p className="text-xs mt-1">A secure, decentralized peer-to-peer messaging app with Windows 95 aesthetics</p>
          </div>
        </div>
      </Win95Window>
    </div>
  );
}
