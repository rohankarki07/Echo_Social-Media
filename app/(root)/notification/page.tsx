import { fetchUser, getNotification } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  // Get notifications and reverse the order
  const notification = (await getNotification(userInfo._id)).reverse();

  return (
    <section>
      <h1 className="head-text mb-10">Notification</h1>
      <section className="mt-10 flex flex-col gap-5">
        {notification.length > 0 ? (
          <>
            {notification.map((notification) => (
              <Link
                key={notification._id}
                href={`/post/${notification.parentId}`}
              >
                <article className="notification-card">
                  <Image
                    src={notification.author.image}
                    alt="Profile Picture"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular text-light-1 ">
                    <span className="mr-1 text-primary-500">
                      {notification.author.name}
                    </span>
                    replied to your Post
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No Notification</p>
        )}
      </section>
    </section>
  );
};

export default page;
