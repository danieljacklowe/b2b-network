'use client';

import { useState, useEffect } from 'react';

type Connection = {
  id: string;
  personTitle: string;
  companyName: string;
  industry: string;
  strength: number;
  context: string;
};

export default function MyNetwork() {
  const [myDoors, setMyDoors] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/connections/me')
      .then(res => res.json())
      .then(data => {
        setMyDoors(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-gray-500 animate-pulse py-4">Loading your network...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-12 relative">
      <div className="flex justify-between items-end border-b pb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Network</h2>
          <p className="text-gray-500 text-sm mt-1">The doors you bring to the community.</p>
        </div>
        <span className="text-orange-700 text-sm font-bold bg-orange-100 border border-orange-200 px-4 py-1.5 rounded-full">
          {myDoors.length} Doors Uploaded
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myDoors.length === 0 ? (
          <p className="text-gray-500 col-span-2">You haven't added any connections yet.</p>
        ) : (
          myDoors.map(door => (
            <div key={door.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-bold text-gray-900">{door.companyName}</h4>
                <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {door.industry}
                </span>
              </div>
              <p className="text-orange-600 font-semibold mb-3">{door.personTitle}</p>
              
              <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 border border-gray-100">
                <span className="font-semibold block text-xs text-gray-400 uppercase tracking-wider mb-1">Your Context</span>
                {door.context}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}