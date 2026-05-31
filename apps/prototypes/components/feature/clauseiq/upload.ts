import { CLAUSEIQ_FILE_LIMIT_MB, type ClauseIQUploadedFile } from '@/data/clauseiq-mock';
import type { ClauseIQUploadError } from './types';

export function validateClauseIQFile(file: File, maxSizeMb = CLAUSEIQ_FILE_LIMIT_MB): { file?: ClauseIQUploadedFile; error?: ClauseIQUploadError } {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

  if (!isPdf) return { error: 'unsupported' };
  if (file.size > maxSizeMb * 1024 * 1024) return { error: 'too-large' };

  return {
    file: {
      name: file.name,
      size: file.size,
      type: file.type || 'application/pdf',
    },
  };
}
