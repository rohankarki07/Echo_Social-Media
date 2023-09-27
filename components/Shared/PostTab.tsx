import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import PostCard from "../Cards/PostCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const PostTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let result: any;

  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result || !result.post) {
    redirect("/");
    return null;
  }

  // Access the posts using result.post
  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.post.length > 0 ? (
        result.post.map((post: any) => (
          <PostCard
            key={post._id}
            id={post._id}
            currentUserId={currentUserId}
            parentId={post.parentId}
            content={post.text}
            author={
              accountType === "User"
                ? { name: result.name, image: result.image, id: result.id }
                : {
                    name: post.author.name,
                    image: post.author.image,
                    id: post.author.id,
                  }
            }
            community={post.community}
            createdAt={post.createdAt}
            comments={post.children}
          />
        ))
      ) : (
        <p>No posts to display</p>
      )}
    </section>
  );
};

export default PostTab;
