/**
 *
 * @param valueList 转化为百分比的数组
 * @param range 值所在的范围
 * @returns 转化后的数组
 */
export const mapValueToPercent = (
  valueList: number[],
  range: [number, number]
) => {
  const [low, high] = range;
  return valueList.map(item => {
    const percent = (item / (high - low)) * 100;
    return percent;
  });
};

export const clamp = (low: number, val: number, high: number) =>
  Math.min(high, Math.max(val, low));

export const defaultPalette = ['green', 'pink', 'orange', 'navy', 'gray'];
