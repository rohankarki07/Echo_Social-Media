import PostCard from "@/components/Cards/PostCard";
import { fetchPosts } from "@/lib/actions/post.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const result = await fetchPosts(1, 30);

  const user = await currentUser();

  if (!user) return null;

  const postsByOthers = result.posts.filter(
    (post) => post.author.id !== user.id
  );

  return (
    <>
      <h1 className="text-left head-text">Home</h1>

      <section className="flex flex-col gap-10 mt-9">
        {postsByOthers.length === 0 ? (
          <p className="no-result">No Post found</p>
        ) : (
          <>
            {postsByOthers.map((post) => (
              <PostCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
