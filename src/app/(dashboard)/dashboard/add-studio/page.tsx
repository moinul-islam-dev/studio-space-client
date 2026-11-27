import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth-actions";
import AddStudioForm from "../../_components/AddStudioForm";

const AddStudioPage = async () => {
  
    const user = await getCurrentUser();

    if(!user) {
        redirect("/login")
    } 

  return (
    <div className="w-full min-w-0 flex-1 bg-background px-4 py-6 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <AddStudioForm user={user} />
    </div>
  );
};

export default AddStudioPage;
