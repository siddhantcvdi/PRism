import {create} from 'zustand';

// Create a store
const useStore = create((set) => ({
    isGitHubAuth: false,
    isGitHubLoading: false, 
    setIsGitHubAuth: (isGitHubAuth) => set({isGitHubAuth}),  
    setIsGitHubLoading: (isGitHubLoading) => set({isGitHubLoading}),                           
    
}));

export default useStore;