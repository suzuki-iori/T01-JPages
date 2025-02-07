function useFilterData(data = []) {
  const nowDate = new Date();
  const nowYear = nowDate.getFullYear();
  const nowMonth = nowDate.getMonth() + 1; // 月は0始まりなので +1

  // 今年度の開始年と終了年を計算
  const fiscalYearStart = nowMonth >= 4 ? nowYear : nowYear - 1;
  const fiscalYearEnd = fiscalYearStart + 1;

  return data.filter(item => {
    const date = new Date(item.created_at);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    // 今年度（4月〜翌年3月）の範囲に収まるかを判定
    return (
      (year === fiscalYearStart && month >= 4) || // 開始年の4月以降
      (year === fiscalYearEnd && month <= 3)     // 終了年の3月まで
    );
  });
}

export default useFilterData;
