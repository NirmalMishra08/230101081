'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { setAuthToken, Log } from '../logging_middleware/logger';

interface Notification {
  ID: string;
  Type: 'Placement' | 'Result' | 'Event';
  Message: string;
  Timestamp: string;
}


const typePriority = { 
  Placement: 3, 
  Result: 2, 
  Event: 1 
};

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [priorityNotifications, setPriorityNotifications] = useState<Notification[]>([]);
  const [limit, setLimit] = useState(10);
  const [activeTab, setActiveTab] = useState(0);
  const [filterType, setFilterType] = useState('All');
  const [loading, setLoading] = useState(true);

  const token = process.env.NEXT_PUBLIC_AUTH_TOKEN || '';

  const fetchNotifications = async () => {
    try {
      Log("frontend", "info", "api", "Fetching notifications from server...");

      const { data } = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(data.notifications || []);
      Log("frontend", "info", "api", 
        `Successfully fetched ${data.notifications?.length || 0} notifications`);
      
    } catch (err: any) {
      Log("frontend", "error", "api", `Failed to fetch notifications: ${err.message}`);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityNotifications = (nots: Notification[], n: number) => {
    return [...nots]
      .sort((a, b) => {
        const priorityA = typePriority[a.Type as keyof typeof typePriority];
        const priorityB = typePriority[b.Type as keyof typeof typePriority];
        
        const timeA = new Date(a.Timestamp).getTime();
        const timeB = new Date(b.Timestamp).getTime();

        if (priorityA !== priorityB) return priorityB - priorityA;
        return timeB - timeA;
      })
      .slice(0, n);
  };

  useEffect(() => {
    if (token) setAuthToken(token);
    
    Log("frontend", "info", "page", "Campus Notifications page loaded");
    fetchNotifications();
  }, [token]);

  useEffect(() => {
    if (notifications.length > 0) {
      setPriorityNotifications(getPriorityNotifications(notifications, limit));
    }
  }, [notifications, limit]);

  const filteredNotifications = notifications.filter(n => 
    filterType === 'All' || n.Type === filterType
  );

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    return minutes < 60 ? `${minutes}m ago` : `${Math.floor(minutes/60)}h ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Campus Notifications
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-8 border-b">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab(0)}
              className={`pb-3 text-lg font-medium transition-all ${
                activeTab === 0 
                  ? 'text-blue-600 border-b-4 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Priority Inbox
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`pb-3 text-lg font-medium transition-all ${
                activeTab === 1 
                  ? 'text-blue-600 border-b-4 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All Notifications
            </button>
          </div>
        </div>

        {/* Priority Inbox */}
        {activeTab === 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Priority Inbox (Top {limit})
              </h2>
              
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[5, 10, 15, 20].map(n => (
                  <option key={n} value={n}>Top {n}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {priorityNotifications.map((notif) => (
                <div 
                  key={notif.ID}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium
                      ${notif.Type === 'Placement' ? 'bg-green-100 text-green-700' : 
                        notif.Type === 'Result' ? 'bg-blue-100 text-blue-700' : 
                        'bg-orange-100 text-orange-700'}`}>
                      {notif.Type}
                    </span>
                    
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      {getTimeAgo(notif.Timestamp)}
                    </div>
                  </div>

                  <p className="text-lg font-medium text-gray-900 leading-relaxed">
                    {notif.Message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Notifications</option>
                <option value="Placement">Placement</option>
                <option value="Result">Result</option>
                <option value="Event">Event</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotifications.map((notif) => (
                <div 
                  key={notif.ID}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-4
                    ${notif.Type === 'Placement' ? 'bg-green-100 text-green-700' : 
                      notif.Type === 'Result' ? 'bg-blue-100 text-blue-700' : 
                      'bg-orange-100 text-orange-700'}`}>
                    {notif.Type}
                  </div>
                  
                  <p className="text-gray-800 font-medium mb-3">
                    {notif.Message}
                  </p>
                  
                  <p className="text-sm text-gray-500">
                    {new Date(notif.Timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}