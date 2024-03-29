import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Avatar from "../ui/Avatar";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  isSpecificPost?: boolean;
}

const PostCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
  isSpecificPost,
}: Props) => {
  // Check if author exists and has an 'id' property
  const authorId = author?.id || "";

  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-row flex-1 w-full gap-4">
          <div className="flex flex-col items-center">
            {authorId && ( // Check if authorId exists before rendering the Link
              <Link
                href={`/profile/${author.id}`}
                className="relative h-11 w-11"
              >
                <Image
                  src={author.image}
                  alt="Profile image"
                  fill
                  className="rounded-full cursor-pointer"
                />
              </Link>
            )}
            <div className="post-card_bar" />
            {/* images of the lastest 3 commentor  */}
            {!isSpecificPost && comments.length > 0 && (
              <Link href={`/post/${id}`}>
                <div className="flex">
                  {comments.slice(-3).map((comment, index) => (
                    <div key={`comment-${index}`}>
                      <Avatar src={comment.author.image} alt="Image" />
                    </div>
                  ))}
                </div>
              </Link>
            )}
          </div>
          <div className="flex-col w-full flex-">
            {authorId && ( // Check if authorId exists before rendering the Link
              <Link href={`/profile/${author.id}`} className="w-fit">
                <h4 className="cursor-pointer text-base-semibold text-light-1 ">
                  {author.name}
                </h4>
              </Link>
            )}
            <p className="mt-2 text-small-regular text-light-2">{content}</p>
            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <Image
                  src="/assets/heart-gray.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="object-contain cursor-pointer"
                />
                <Link href={`/post/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="object-contain cursor-pointer"
                  />
                </Link>
                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  width={24}
                  height={24}
                  className="object-contain cursor-pointer"
                />
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width={24}
                  height={24}
                  className="object-contain cursor-pointer"
                />
              </div>
              {!isSpecificPost && comments.length > 0 && (
                <Link href={`/post/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* todo delete post */}
      {/* todo show comment logo */}
      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className="flex items-center mt-5"
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)} - {community.name} Community
          </p>
          <Image
            src={community.image}
            alt={community.name}
            width={14}
            height={14}
            className="object-cover ml-1 rounded-full"
          />
        </Link>
      )}
    </article>
  );
};

export default PostCard;
