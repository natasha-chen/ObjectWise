import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { objectDatabase } from '../data/objectDatabase';
import { cacheService } from './cacheService';

const ObjectContext = createContext();

const initialState = {
    currentObject: null,
    identifiedObjects: [],
    searchResults: [],
    communityTips: [],
    loading: false,
    error: null,
    confidence: 0
};

const objectReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'SET_CURRENT_OBJECT':
            return { ...state, currentObject: action.payload, loading: false };
        case 'SET_CONFIDENCE':
            return { ...state, confidence: action.payload };
        case 'ADD_IDENTIFIED_OBJECT':
            return { 
                ...state, 
                identifiedObjects: [action.payload, ...state.identifiedObjects.slice(0, 9)]
            };
        case 'SET_SEARCH_RESULTS':
            return { ...state, searchResults: action.payload };
        case 'ADD_COMMUNITY_TIP':
            return { 
                ...state, 
                communityTips: [action.payload, ...state.communityTips] 
            };
        default:
            return state;
    }
};

export const ObjectProvider = ({ children }) => {
    const [state, dispatch] = useReducer(objectReducer, initialState);

    useEffect(() => {
        loadCachedData();
    }, []);

    const loadCachedData = async () => {
        try {
            const cachedHistory = await cacheService.getIdentificationHistory();
            if (cachedHistory.length > 0) {
                cachedHistory.forEach(obj => {
                    dispatch({ type: 'ADD_IDENTIFIED_OBJECT', payload: obj });
                });
            }
        } catch (error) {
            console.error('Failed to load cached data:', error);
        }
    };

    const identifyObject = async (imageData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const result = await performObjectRecognition(imageData);
            
            if (result.object) {
                dispatch({ type: 'SET_CURRENT_OBJECT', payload: result.object });
                dispatch({ type: 'SET_CONFIDENCE', payload: result.confidence });
                dispatch({ type: 'ADD_IDENTIFIED_OBJECT', payload: result.object });
                
                await cacheService.saveIdentification(result.object);
            } else {
                dispatch({ type: 'SET_ERROR', payload: 'Object not recognized' });
            }
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const performObjectRecognition = async (imageData) => {
        const mockRecognition = new Promise((resolve) => {
            setTimeout(() => {
                const randomObject = objectDatabase[Math.floor(Math.random() * objectDatabase.length)];
                const confidence = Math.random() * 0.4 + 0.6;
                resolve({
                    object: randomObject,
                    confidence: Math.round(confidence * 100)
                });
            }, 2000);
        });

        return await mockRecognition;
    };

    const searchObjects = (query) => {
        const results = objectDatabase.filter(obj =>
            obj.name.toLowerCase().includes(query.toLowerCase()) ||
            obj.category.toLowerCase().includes(query.toLowerCase()) ||
            obj.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
    };

    const addCommunityTip = (tip) => {
        dispatch({ type: 'ADD_COMMUNITY_TIP', payload: tip });
    };

    const value = {
        ...state,
        identifyObject,
        searchObjects,
        addCommunityTip
    };

    return (
        <ObjectContext.Provider value={value}>
            {children}
        </ObjectContext.Provider>
    );
};

export const useObject = () => {
    const context = useContext(ObjectContext);
    if (!context) {
        throw new Error('useObject must be used within an ObjectProvider');
    }
    return context;
};