'use client';

import { useState } from 'react';
import TradingFloorFeed from './TradingFloorFeed';
import AvailableDoors from './AvailableDoors';
import MyNetwork from './MyNetwork';

export default function DashboardTabs({ currentUserEmail, currentUserName }: { currentUserEmail: string, currentUserName: string }) {
  const [activeTab, setActiveTab] = useState<'feed' | 'directory' | 'network'>('feed');

  return (
    <div className="mt-12">
      {/* Tab Navigation Bar */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('feed')}
          className={`pb-4 px-6 text-sm font-bold whitespace-nowrap transition-colors ${
            activeTab === 'feed' 
              ? 'border-b-2 border-orange-600 text-orange-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📰 Trading Floor Feed
        </button>
        <button
          onClick={() => setActiveTab('directory')}
          className={`pb-4 px-6 text-sm font-bold whitespace-nowrap transition-colors ${
            activeTab === 'directory' 
              ? 'border-b-2 border-orange-600 text-orange-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🔍 Available Doors
        </button>
        <button
          onClick={() => setActiveTab('network')}
          className={`pb-4 px-6 text-sm font-bold whitespace-nowrap transition-colors ${
            activeTab === 'network' 
              ? 'border-b-2 border-orange-600 text-orange-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🤝 My Network
        </button>
      </div>

      {/* Conditional Rendering of the Components */}
      <div className="min-h-[500px]">
        {activeTab === 'feed' && (
          <TradingFloorFeed currentUserEmail={currentUserEmail} currentUserName={currentUserName} />
        )}
        {activeTab === 'directory' && (
          <AvailableDoors currentUserEmail={currentUserEmail} currentUserName={currentUserName} />
        )}
        {activeTab === 'network' && (
          <MyNetwork />
        )}
      </div>
    </div>
  );
}