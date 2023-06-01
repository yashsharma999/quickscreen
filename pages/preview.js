import { useRecoilState } from "recoil";
import FinalForm from "../components/FinalForm";
import { formState as formStateAtom } from "../atoms/form";
import DashboardLayout from "@/components/template/DashboardLayout";

const Preview = () => {
  const [formState, setFormState] = useRecoilState(formStateAtom);
  console.log("formState", formState);
  return (
    <DashboardLayout>
      <FinalForm list={formState} />
    </DashboardLayout>
  );
};

export default Preview;
