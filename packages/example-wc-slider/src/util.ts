export const randInt = (low: number, high: number) => {
  const lowInt = Math.floor(low);
  const highInt = Math.floor(high);
  return lowInt + Math.ceil(Math.random() * (highInt - lowInt));
};

export const mock = (count: number) => {
  const reuslt = [];

  const countInt = Math.floor(count);
  const _countInt = Math.max(countInt, 4);
  for (let i = 0; i < _countInt; i += 1) {
    const value = randInt(0, 100);
    reuslt.push(value);
  }

  return reuslt;
};
