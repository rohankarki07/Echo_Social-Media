"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import { CommentValidation } from "@/lib/validations/post";
import Image from "next/image";
import { addCommentToPost } from "@/lib/actions/post.actions";

interface Props {
  postId: string;
  currentUserImg: string;
  currentUserId: string;
}
const Comment = ({ postId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      post: "",
      accountId: currentUserId,
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToPost(
      postId,
      values.post,
      JSON.parse(currentUserId),
      pathname
    );
    form.reset();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        {/* name  */}
        <FormField
          control={form.control}
          name="post"
          render={({ field }) => (
            <FormItem className="flex gap-3 items-center w-full">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="Profile Image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent ">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
