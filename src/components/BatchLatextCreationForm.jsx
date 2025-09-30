import { useSelector } from "react-redux";

export default function BatchLatextCreationForm() {
  const activeBatch = useSelector((state) => state.batchList.activeBatch);

  console.log(activeBatch);
  return <div className="text-lg font-bold">{JSON.stringify(activeBatch)}</div>;
}
