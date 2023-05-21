import { format } from 'sql-formatter';

export function formatSql(content: string) {
  return format(content, {
    language: 'sql',
    tabWidth: 2,
    keywordCase: 'upper',
    linesBetweenQueries: 2,
  })
}