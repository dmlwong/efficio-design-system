import { CLAUSEIQ_RESULT } from '@/data/clauseiq-mock';
import type { ClauseIQAction, ClauseIQState } from './types';

export const initialClauseIQState: ClauseIQState = {
  step: 'welcome',
  selectedParameter: undefined,
  expandedParameter: undefined,
  parameterSearch: '',
  saveToDocuments: false,
  initiativeModalOpen: false,
  initiativeTab: 'mine',
  initiativeSearch: '',
};

export function clauseIQReducer(state: ClauseIQState, action: ClauseIQAction): ClauseIQState {
  switch (action.type) {
    case 'START_FLOW':
      return { ...state, step: 'select-initiative', previousAnalysis: undefined, uploadError: undefined };
    case 'OPEN_INITIATIVE_MODAL':
      return { ...state, initiativeModalOpen: true, initiativeSearch: '' };
    case 'CLOSE_INITIATIVE_MODAL':
      return {
        ...state,
        initiativeModalOpen: false,
        initiativeSearch: '',
        step: state.selectedInitiative && state.step === 'select-initiative' ? 'select-parameters' : state.step,
      };
    case 'SET_INITIATIVE_TAB':
      return { ...state, initiativeTab: action.tab };
    case 'SET_INITIATIVE_SEARCH':
      return { ...state, initiativeSearch: action.value };
    case 'SELECT_INITIATIVE':
      return {
        ...state,
        step: 'select-parameters',
        selectedInitiative: action.initiative,
        selectedParameter: undefined,
        previousAnalysis: undefined,
        expandedParameter: undefined,
        parameterSearch: '',
        uploadedFile: undefined,
        uploadError: undefined,
        analysisResult: undefined,
        saveToDocuments: false,
        initiativeModalOpen: false,
        initiativeSearch: '',
      };
    case 'EDIT_INITIATIVE':
      if (state.step === 'processing') return state;
      return {
        ...state,
        step: 'select-initiative',
        selectedInitiative: undefined,
        selectedParameter: undefined,
        previousAnalysis: undefined,
        expandedParameter: undefined,
        parameterSearch: '',
        initiativeModalOpen: true,
        uploadedFile: undefined,
        uploadError: undefined,
        analysisResult: undefined,
        saveToDocuments: false,
      };
    case 'TOGGLE_PARAMETER_EXPANSION':
      return {
        ...state,
        expandedParameter: state.expandedParameter === action.kind ? undefined : action.kind,
        parameterSearch: '',
      };
    case 'SET_PARAMETER_SEARCH':
      return { ...state, parameterSearch: action.value };
    case 'SELECT_PARAMETER':
      return {
        ...state,
        step: 'upload-contract',
        selectedParameter: action.parameter,
        previousAnalysis: undefined,
        expandedParameter: undefined,
        parameterSearch: '',
        uploadedFile: undefined,
        uploadError: undefined,
        analysisResult: undefined,
        saveToDocuments: false,
      };
    case 'EDIT_PARAMETER':
      if (state.step === 'processing') return state;
      return {
        ...state,
        step: 'select-parameters',
        selectedParameter: undefined,
        previousAnalysis: undefined,
        expandedParameter: undefined,
        parameterSearch: '',
        uploadedFile: undefined,
        uploadError: undefined,
        analysisResult: undefined,
        saveToDocuments: false,
      };
    case 'SET_UPLOAD_ERROR':
      return { ...state, uploadError: action.error };
    case 'SELECT_FILE':
      return {
        ...state,
        step: 'processing',
        uploadedFile: action.file,
        uploadError: undefined,
        analysisResult: undefined,
      };
    case 'PROCESSING_COMPLETE':
      if (state.step !== 'processing' || !state.uploadedFile) return state;
      return { ...state, step: 'results', analysisResult: action.result };
    case 'TOGGLE_SAVE':
      return { ...state, saveToDocuments: action.checked };
    case 'TOGGLE_PREVIOUS_ANALYSIS_SAVE':
      if (!state.previousAnalysis) return state;
      return {
        ...state,
        previousAnalysis: {
          ...state.previousAnalysis,
          saveToDocuments: action.checked,
        },
      };
    case 'RUN_ANOTHER_ANALYSIS':
      if (!state.uploadedFile || !state.analysisResult || !state.selectedInitiative || !state.selectedParameter) {
        return state;
      }
      return {
        ...state,
        step: 'upload-contract',
        previousAnalysis: {
          file: state.uploadedFile,
          result: state.analysisResult,
          saveToDocuments: state.saveToDocuments,
        },
        uploadedFile: undefined,
        uploadError: undefined,
        analysisResult: undefined,
        saveToDocuments: false,
        initiativeModalOpen: false,
        initiativeTab: state.initiativeTab,
        initiativeSearch: '',
        expandedParameter: undefined,
        parameterSearch: '',
      };
    default:
      return state;
  }
}

export function buildClauseIQResult() {
  return CLAUSEIQ_RESULT;
}
