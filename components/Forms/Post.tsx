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
import { Textarea } from "../ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import { useOrganization } from "@clerk/nextjs";

import { PostValidation } from "@/lib/validations/post";
import { createPost } from "@/lib/actions/post.actions";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const Post = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  const form = useForm({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      post: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof PostValidation>) => {
    await createPost({
      text: values.post,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
      organizationId: organization ? organization.id : null,
    });
    router.push("/");
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-start gap-10 mt-10 "
        >
          {/* name  */}
          <FormField
            control={form.control}
            name="post"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2 ">
                  Content
                </FormLabel>
                <FormControl className="border no-focus border-dark-4 bg-dark-3 text-light-1 ">
                  <Textarea rows={15} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-primary-500">
            Post
          </Button>
        </form>
      </Form>
    </>
  );
};

export default Post;
