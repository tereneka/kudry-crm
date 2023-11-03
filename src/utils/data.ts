interface AnyBdData {
  id: string;
}

function getDataById<T extends AnyBdData>(
  dataList: T[] | undefined,
  id: string
) {
  return dataList?.find((data) => data.id === id);
}

export { getDataById };
