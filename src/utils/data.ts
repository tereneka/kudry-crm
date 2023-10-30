interface AnyBdData {
  id: string;
  [key: string]: any;
}

function getDataById(
  dataList: AnyBdData[] | undefined,
  id: string
) {
  return dataList?.find((data) => data.id === id);
}

export { getDataById };
