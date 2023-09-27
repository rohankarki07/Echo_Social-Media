import Post from "@/components/Forms/Post";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
const page = async () => {
  const user = await currentUser();

  if (!user) return null;
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text mb-10">Create Post</h1>
      <Post userId={userInfo._id.toString()} />
    </>
  );
};

export default page;
