import CameraComp from "../components/CameraComp";
import ProcessVariableList from "../components/ProcessVariableList";
import ProcessVariablesEdit from "../components/ProcessVariablesEdit";

export default function Settings() {
  return (
    <div className="text-lg font-bold">
      <ProcessVariablesEdit />
      {/* <CameraComp /> */}
    </div>
  );
}
