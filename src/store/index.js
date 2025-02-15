import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import { api } from '@/api/api'

export const store = configureStore({
    reducer: { ...rootReducer, [api.reducerPath]: api.reducer },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        }).concat(api.middleware)
    },
})

export default store
