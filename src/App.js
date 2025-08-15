import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import CameraCapture from './components/CameraCapture';
import ObjectDetails from './components/ObjectDetails';
import Navigation from './components/Navigation';
import SearchPage from './components/SearchPage';
import CommunityPage from './components/CommunityPage';
import { ObjectProvider } from './services/ObjectContext';

function App() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <ObjectProvider>
            <div className="app">
                {!isOnline && (
                    <div className="offline-banner">
                        🔌 Offline Mode - Using cached data
                    </div>
                )}
                
                <Routes>
                    <Route path="/" element={<CameraCapture />} />
                    <Route path="/object/:id" element={<ObjectDetails />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                </Routes>
                
                <Navigation />
            </div>
        </ObjectProvider>
    );
}

export default App;