'use client';

import { useState, useEffect } from 'react';

export default function MyTrades() {
  const [myOpenAsks, setMyOpenAsks] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [myOffers, setMyOffers] = useState<any[]>([]);
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // NEW: State to track which star is being hovered over for each trade
  const [hoveredStars, setHoveredStars] = useState<Record<string, number>>({});

  const fetchTrades = () => {
    fetch('/api/trades/me')
      .then(res => res.json())
      .then(data => {
        if (data.myOpenAsks) setMyOpenAsks(data.myOpenAsks);
        if (data.myRequests) setMyRequests(data.myRequests);
        if (data.myOffers) setMyOffers(data.myOffers);
        if (data.credits !== undefined) setCredits(data.credits);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTrades();
    window.addEventListener('askPosted', fetchTrades);
    return () => window.removeEventListener('askPosted', fetchTrades);
  }, []);

  const handleAcceptIntro = async (tradeId: string) => {
    if (credits < 1) {
      alert("You don't have enough credits! Offer an intro to someone else to earn a credit.");
      return;
    }

    setProcessingId(tradeId);
    const res = await fetch('/api/trades/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tradeId })
    });

    const data = await res.json();
    
    if (res.ok) {
      alert("Intro Accepted! 1 Credit transferred.");
      fetchTrades();
    } else {
      alert(data.error || "Something went wrong.");
    }
    setProcessingId(null);
  };

  const handleRateIntro = async (tradeId: string, stars: number) => {
    const res = await fetch('/api/trades/rate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tradeId, stars })
    });

    if (res.ok) {
      alert(`Thanks for rating this intro ${stars} stars!`);
      fetchTrades(); 
    } else {
      alert("Something went wrong saving your rating.");
    }
  };

  if (loading) return <div className="text-gray-500 animate-pulse py-4">Loading your active trades...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 mb-12">
      
      {/* Header with Wallet Balance */}
      <div className="flex justify-between items-end border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-900">My Deal Desk</h2>
        <div className="flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-bold">
          <span>🪙 {credits} Credits</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Intros I Need */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-700 mb-4">🚪 Intros I Need</h3>
          
          {myOpenAsks.length === 0 && myRequests.length === 0 ? (
            <p className="text-gray-400 text-sm">No active requests yet.</p>
          ) : (
            <div className="space-y-4">
              
              {/* Open Asks */}
              {myOpenAsks.map(ask => (
                <div key={ask.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900">{ask.company}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-gray-200 text-gray-700 rounded-full">WAITING</span>
                  </div>
                  <p className="text-sm text-gray-600">You asked for: <span className="font-semibold">{ask.role}</span></p>
                </div>
              ))}

              {/* Active Trades */}
              {myRequests.map(trade => (
                <div key={trade.id} className={`p-4 rounded-lg border shadow-sm ${trade.status === 'COMPLETED' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900">{trade.company}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${trade.status === 'COMPLETED' ? 'bg-green-600 text-white' : 'bg-orange-600 text-white'}`}>
                      {trade.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 mb-2">
                    <span className="font-bold">{trade.offererName}</span> offered to help!
                  </p>
                  
                  {/* The Payment Button */}
                  {trade.status === 'PENDING' && (
                    <button 
                      onClick={() => handleAcceptIntro(trade.id)}
                      disabled={processingId === trade.id}
                      className="w-full mt-2 bg-gray-900 text-white text-sm font-bold py-2 rounded hover:bg-gray-800 transition disabled:opacity-50">
                      {processingId === trade.id ? 'Processing...' : 'Accept Intro (-1 Credit)'}
                    </button>
                  )}
                  
                  {/* The Upgraded Rating UI */}
                  {trade.status === 'COMPLETED' && !trade.isRated && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-xs text-green-800 font-bold mb-2">Rate this intro:</p>
                      
                      {/* We track when the mouse leaves the entire star area to reset it */}
                      <div 
                        className="flex gap-1"
                        onMouseLeave={() => setHoveredStars(prev => ({ ...prev, [trade.id]: 0 }))}
                      >
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isHovered = (hoveredStars[trade.id] || 0) >= star;
                          return (
                            <button
                              key={star}
                              onClick={() => handleRateIntro(trade.id, star)}
                              onMouseEnter={() => setHoveredStars(prev => ({ ...prev, [trade.id]: star }))}
                              className={`text-2xl transition transform hover:scale-110 ${
                                isHovered ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              title={`Rate ${star} stars`}
                            >
                              ★
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Show when already rated */}
                  {trade.status === 'COMPLETED' && trade.isRated && (
                    <div className="mt-3 pt-3 border-t border-green-200 flex items-center gap-1 text-sm font-bold text-yellow-600">
                      <span>Rated:</span>
                      {[...Array(trade.rating || 5)].map((_, i) => <span key={i}>★</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Intros I'm Offering */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-700 mb-4">🤝 Intros I'm Offering</h3>
          {myOffers.length === 0 ? (
            <p className="text-gray-400 text-sm">You haven't offered any intros yet.</p>
          ) : (
            <div className="space-y-4">
              {myOffers.map(trade => (
                <div key={trade.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900">{trade.company}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${trade.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {trade.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    You offered an intro to <span className="font-semibold">{trade.requesterEmail}</span>.
                  </p>
                  {trade.status === 'COMPLETED' && (
                    <p className="text-xs text-green-600 font-bold mt-2">+1 Credit Earned!</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}