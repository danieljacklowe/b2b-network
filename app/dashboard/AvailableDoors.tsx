'use client';

import { useState, useEffect } from 'react';

type Door = {
  id: string;
  personTitle: string;
  companyName: string;
  industry: string;
  strength: number;
  user: { firstName: string };
};

export default function AvailableDoors({ currentUserEmail, currentUserName }: { currentUserEmail: string, currentUserName: string }) {
  const [doors, setDoors] = useState<Door[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State for Requesting an Intro
  const [selectedDoor, setSelectedDoor] = useState<Door | null>(null);
  const [askContext, setAskContext] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/connections/directory')
      .then(res => res.json())
      .then(data => {
        setDoors(data);
        setLoading(false);
      });
  }, []);

  // Filter doors based on the search bar
  const filteredDoors = doors.filter(door => 
    door.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    door.personTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    door.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRequestIntro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoor) return;
    setIsSubmitting(true);

    // We automatically create an "Opportunity" targeted at this specific door
    const res = await fetch('/api/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userEmail: currentUserEmail,
        userName: currentUserName,
        company: selectedDoor.companyName,
        role: selectedDoor.personTitle,
        ask: `(Targeting ${selectedDoor.user.firstName}'s connection): ${askContext}`,
      })
    });

    if (res.ok) {
      alert("Request posted to the Trading Floor!");
      setSelectedDoor(null);
      setAskContext('');
      window.dispatchEvent(new Event('askPosted')); // Updates your Deal Desk instantly!
    }
    setIsSubmitting(false);
  };

  if (loading) return <div className="text-gray-500 animate-pulse py-4">Loading the network...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-12 relative">
      <div className="flex justify-between items-end border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-900">Available Doors</h2>
        <span className="text-gray-500 text-sm font-medium">{doors.length} active connections</span>
      </div>

      {/* Search Bar */}
      <input 
        type="text" 
        placeholder="Search by company (e.g. Stripe), title, or industry..." 
        className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-orange-500 focus:border-orange-500"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoors.length === 0 ? (
          <p className="text-gray-500 col-span-2">No doors found matching your search.</p>
        ) : (
          filteredDoors.map(door => (
            <div key={door.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-gray-900">{door.companyName}</h4>
                  <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {door.industry}
                  </span>
                </div>
                <p className="text-orange-600 font-semibold mb-1">{door.personTitle}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Door held by <span className="font-semibold">{door.user.firstName}</span> 
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                    Strength: {door.strength}/5
                  </span>
                </p>
              </div>
              <button 
                onClick={() => setSelectedDoor(door)}
                className="w-full bg-gray-100 text-gray-800 font-bold py-2 rounded-md hover:bg-gray-200 transition">
                Request Intro
              </button>
            </div>
          ))
        )}
      </div>

      {/* Request Modal */}
      {selectedDoor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Request this Door</h3>
            <p className="text-gray-600 mb-6">
              You are asking <span className="font-semibold">{selectedDoor.user.firstName}</span> for an intro to their <span className="font-semibold">{selectedDoor.personTitle} at {selectedDoor.companyName}</span>.
            </p>
            
            <form onSubmit={handleRequestIntro} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to meet them?</label>
                <textarea 
                  required 
                  placeholder="Keep it concise and highlight mutual value..." 
                  className="w-full p-3 border rounded-md h-24"
                  value={askContext} 
                  onChange={e => setAskContext(e.target.value)} 
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setSelectedDoor(null)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-md hover:bg-gray-200 transition">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-md hover:bg-orange-700 transition">
                  {isSubmitting ? 'Posting...' : 'Post Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}