'use client';

import { useCallback } from 'react';

const CAMEL_CASE_REGEX = /([A-Z])/g;
const LEADING_WHITESPACE_REGEX = /^\s/;
const PLURAL_Y_REGEX = /[aeiou]y$/;
const PLURAL_ES_REGEX = /(x|ch|sh)$/;
const SINGULAR_IES_REGEX = /ies$/;
const SINGULAR_ES_REGEX = /(xes|ches|shes)$/;
const SINGULAR_S_REGEX = /s$/;

export function useUserFriendlyName(): (
  name: string | undefined,
  options?: 'plural' | 'singular' | { plural?: boolean; singular?: boolean }
) => string {
  return useCallback(
    (
      name: string | undefined,
      options?: 'plural' | 'singular' | { plural?: boolean; singular?: boolean }
    ): string => {
      if (!name) {
        return '';
      }

      // Convert camelCase/PascalCase to space-separated words
      const spaced = name
        .replace(CAMEL_CASE_REGEX, ' $1')
        .replace(LEADING_WHITESPACE_REGEX, '')
        .toLowerCase();

      // Handle string options for backward compatibility
      if (options === 'plural') {
        return pluralize(spaced);
      }

      if (options === 'singular') {
        return singularize(spaced);
      }

      // Handle object options
      if (typeof options === 'object') {
        if (options?.plural) {
          return pluralize(spaced);
        }
        if (options?.singular) {
          return singularize(spaced);
        }
      }

      return spaced;
    },
    []
  );
}

function pluralize(word: string): string {
  if (
    word.endsWith('s') ||
    PLURAL_ES_REGEX.test(word) ||
    word.endsWith('x') ||
    word.endsWith('ch') ||
    word.endsWith('sh')
  ) {
    return `${word}es`;
  }
  if (word.endsWith('y') && !PLURAL_Y_REGEX.test(word)) {
    return `${word.slice(0, -1)}ies`;
  }
  return `${word}s`;
}

function singularize(word: string): string {
  if (SINGULAR_IES_REGEX.test(word)) {
    return `${word.slice(0, -3)}y`;
  }
  if (SINGULAR_ES_REGEX.test(word)) {
    return word.slice(0, -2);
  }
  if (SINGULAR_S_REGEX.test(word) && !word.endsWith('ss')) {
    return word.slice(0, -1);
  }
  return word;
}
