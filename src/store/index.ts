import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  createMigrate,
  createTransform,
  persistReducer,
  persistStore,
  type MigrationManifest,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { persistedAnalyzerSchema } from '../lib/validations'
import analyzerReducer from './slices/analyzerSlice'

/**
 * Transform: strip volatile UI + heavy analysis payload from the persisted blob.
 *
 * - snackbar: never rehydrate "still open"
 * - isAnalyzing: worker is gone on reload
 * - analysisResult: large, re-computable, and must not bloat localStorage /
 *   slow rehydrate (T01). PrivacyStorage still saves analyses separately.
 */
const analyzerPersistTransform = createTransform(
  // outbound = serialize to storage
  (inbound: any) => {
    if (!inbound || typeof inbound !== 'object') return inbound
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip intentionally
    const { snackbar: _s, isAnalyzing: _a, analysisResult: _r, ...rest } = inbound
    return {
      ...rest,
      isAnalyzing: false,
      analysisResult: null,
      snackbar: { open: false, message: '', severity: 'success' as const },
    }
  },
  // inbound = rehydrate from storage → zod slim schema (T10) + force null analysis
  (outbound: any) => {
    if (!outbound || typeof outbound !== 'object') {
      return {
        deckList: '',
        deckName: '',
        analysisResult: null,
        isAnalyzing: false,
        isDeckMinimized: false,
        activeTab: 0,
        snackbar: { open: false, message: '', severity: 'success' as const },
      }
    }
    const parsed = persistedAnalyzerSchema.safeParse(outbound)
    if (!parsed.success) {
      // Corrupt blob — return initial-ish state (redux-persist will keep running)
      try {
        storage.removeItem('persist:root')
      } catch {
        // ignore
      }
      return {
        deckList: '',
        deckName: '',
        analysisResult: null,
        isAnalyzing: false,
        isDeckMinimized: false,
        activeTab: 0,
        snackbar: { open: false, message: '', severity: 'success' as const },
      }
    }
    const data = parsed.data
    return {
      deckList: data.deckList,
      deckName: data.deckName,
      activeTab: data.activeTab,
      isDeckMinimized: data.isDeckMinimized,
      isAnalyzing: false,
      analysisResult: null,
      snackbar: { open: false, message: '', severity: 'success' as const },
    }
  },
  { whitelist: ['analyzer'] }
)

/**
 * Migration 1 (2026-04-12): clear volatile UI fields on old blobs.
 * Migration 2 (T01 2026-08-02): also purge analysisResult from pre-v2 blobs.
 */
const migrations: MigrationManifest = {
  1: (state: any) => {
    if (!state || typeof state !== 'object') return state
    return {
      ...state,
      analyzer: state.analyzer
        ? {
            ...state.analyzer,
            isAnalyzing: false,
            snackbar: { open: false, message: '', severity: 'success' as const },
          }
        : undefined,
    }
  },
  2: (state: any) => {
    if (!state || typeof state !== 'object') return state
    return {
      ...state,
      analyzer: state.analyzer
        ? {
            ...state.analyzer,
            isAnalyzing: false,
            analysisResult: null,
            snackbar: { open: false, message: '', severity: 'success' as const },
          }
        : undefined,
    }
  },
}

const persistConfig = {
  key: 'root',
  storage,
  version: 2,
  whitelist: ['analyzer'],
  transforms: [analyzerPersistTransform],
  migrate: createMigrate(migrations, { debug: false }),
}

const rootReducer = combineReducers({
  analyzer: analyzerReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
  devTools: import.meta.env.DEV,
})

export const persistor = persistStore(store)

/** Exported for unit tests (transform + migrations without mounting the app). */
export { analyzerPersistTransform, migrations, persistConfig }

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
