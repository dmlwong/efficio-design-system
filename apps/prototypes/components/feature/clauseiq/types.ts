import type {
  ClauseIQAnalysisResult,
  ClauseIQInitiative,
  ClauseIQUploadedFile,
} from '@/data/clauseiq-mock';

export type ClauseIQStep =
  | 'welcome'
  | 'select-initiative'
  | 'select-parameters'
  | 'upload-contract'
  | 'processing'
  | 'results';

export type ClauseIQCardMode = 'active' | 'default' | 'disabled';

export type ClauseIQInitiativeTab = 'mine' | 'team';

export type ClauseIQUploadError = 'unsupported' | 'too-large';

export type ClauseIQParameterKind = 'Playbook' | 'Category' | 'Country';

export interface ClauseIQSelectedParameter {
  kind: ClauseIQParameterKind;
  label: string;
}

export interface ClauseIQCompletedAnalysis {
  file: ClauseIQUploadedFile;
  result: ClauseIQAnalysisResult;
  saveToDocuments: boolean;
}

export interface ClauseIQState {
  step: ClauseIQStep;
  selectedInitiative?: ClauseIQInitiative;
  selectedParameter?: ClauseIQSelectedParameter;
  previousAnalysis?: ClauseIQCompletedAnalysis;
  expandedParameter?: ClauseIQParameterKind;
  parameterSearch: string;
  uploadedFile?: ClauseIQUploadedFile;
  uploadError?: ClauseIQUploadError;
  analysisResult?: ClauseIQAnalysisResult;
  saveToDocuments: boolean;
  initiativeModalOpen: boolean;
  initiativeTab: ClauseIQInitiativeTab;
  initiativeSearch: string;
}

export type ClauseIQAction =
  | { type: 'START_FLOW' }
  | { type: 'OPEN_INITIATIVE_MODAL' }
  | { type: 'CLOSE_INITIATIVE_MODAL' }
  | { type: 'SET_INITIATIVE_TAB'; tab: ClauseIQInitiativeTab }
  | { type: 'SET_INITIATIVE_SEARCH'; value: string }
  | { type: 'SELECT_INITIATIVE'; initiative: ClauseIQInitiative }
  | { type: 'EDIT_INITIATIVE' }
  | { type: 'TOGGLE_PARAMETER_EXPANSION'; kind: ClauseIQParameterKind }
  | { type: 'SET_PARAMETER_SEARCH'; value: string }
  | { type: 'SELECT_PARAMETER'; parameter: ClauseIQSelectedParameter }
  | { type: 'EDIT_PARAMETER' }
  | { type: 'SET_UPLOAD_ERROR'; error?: ClauseIQUploadError }
  | { type: 'SELECT_FILE'; file: ClauseIQUploadedFile }
  | { type: 'PROCESSING_COMPLETE'; result: ClauseIQAnalysisResult }
  | { type: 'TOGGLE_SAVE'; checked: boolean }
  | { type: 'TOGGLE_PREVIOUS_ANALYSIS_SAVE'; checked: boolean }
  | { type: 'RUN_ANOTHER_ANALYSIS' };
