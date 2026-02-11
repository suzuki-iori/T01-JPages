// 年度計算・フィルタ用ユーティリティ
// 4月始まり年度対応

/**
 * 現在の年度（4月始まり）を返す
 * @returns {number}
 */
export function getCurrentFiscalYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 4 ? year + 1 : year;
}

/**
 * 任意の日付から年度（4月始まり）を計算
 * @param {string|Date} dateStr
 * @returns {number}
 */
export function getFiscalYearFromDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return month >= 4 ? year + 1 : year;
}

/**
 * データ配列からユニークな年度リストを抽出（降順）
 * @param {Array} data
 * @param {string} [key='created_at']
 * @returns {number[]}
 */
export function extractFiscalYears(data, key = 'created_at') {
  const years = data.map(item => getFiscalYearFromDate(item[key]));
  return Array.from(new Set(years)).sort((a, b) => b - a);
}

/**
 * 指定年度でデータをフィルタリング
 * @param {Array} data
 * @param {number|null} year
 * @param {string} [key='created_at']
 * @returns {Array}
 */
export function filterByFiscalYear(data, year, key = 'created_at') {
  if (!year) return data;
  return data.filter(item => getFiscalYearFromDate(item[key]) === year);
}
