import {create} from 'zustand';

// Create a store
const usePRStore = create((set) => ({
    PRList: [],
    setPRList: (pr) => {
        set({PRList: pr})
    }
}));

export default usePRStore;