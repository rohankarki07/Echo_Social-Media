"use server";

import { revalidatePath } from "next/cache";
import Post from "../models/post.model";
import { connectToDb } from "../mongoose";
import User from "../models/user.model";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}
export async function createPost({ text, author, communityId, path }: Params) {
  connectToDb();
  try {
    const CreatedPost = await Post.create({
      text,
      author,
      community: null, // Use the provided communityId
    });

    // Update user Model
    await User.findByIdAndUpdate(author, {
      $push: {
        post: CreatedPost._id,
      },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create Post: ${error.message}`);
  }
}

//pagination and fetching
export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDb();

  //calculate the number of post to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  //fetch the posts that have no parents
  const postsQuery = Post.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentID image",
      },
    });
  const totalPostsCount = await Post.countDocuments({
    parentId: { $in: [null, undefined] },
  });
  const posts = await postsQuery.exec();
  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

export async function fetchPostByID(id: string) {
  connectToDb();
  try {
    // Populate the post data and its related fields
    const post = await Post.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Post,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    if (!post) {
      throw new Error(`Post with ID ${id} not found`);
    }

    return post; // Return the fetched post object
  } catch (error: any) {
    throw new Error(`Error fetching Post: ${error.message}`);
  }
}

export async function addCommentToPost(
  postId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDb();
  try {
    const originalPost = await Post.findById(postId);
    if (!originalPost) {
      throw new Error("Post not found");
    }

    // new post with comment text
    const commentPost = new Post({
      text: commentText,
      author: userId,
      parentId: postId,
    });

    //saving comment
    const savedCommentPost = await commentPost.save();

    originalPost.children.push(savedCommentPost._id);
    await originalPost.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error fetching Post: ${error.message}`);
  }
}
