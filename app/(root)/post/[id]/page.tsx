import PostCard from "@/components/Cards/PostCard";
import Comment from "@/components/Forms/Comment";

import { fetchPostById } from "@/lib/actions/post.actions";
import { fetchUser } from "@/lib/actions/user.actions";

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;

  if (!params.id) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const post = await fetchPostById(params.id);

  return (
    <section className="relative">
      <div>
        <PostCard
          key={post._id}
          id={post._id}
          currentUserId={user.id || ""}
          parentId={post.parentId}
          content={post.text}
          author={post.author}
          community={post.community}
          createdAt={post.createdAt}
          comments={post.children}
          isSpecificPost={true}
        />
      </div>

      <div className="mt-7">
        <Comment
          postId={post.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>
      <div className="mt-10">
        {post.children.map((childItem: any) => (
          <PostCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={childItem.id || ""}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default page;
