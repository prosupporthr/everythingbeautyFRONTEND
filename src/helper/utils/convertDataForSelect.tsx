
export function convertDataForSelect<T>(
    data: T[],
    keys: [keyof T, keyof T]
  ) {
    return data.map((item) => ({
      label: String(item[keys[0]]),
      value: String(item[keys[1]]),
    }));
  }
  