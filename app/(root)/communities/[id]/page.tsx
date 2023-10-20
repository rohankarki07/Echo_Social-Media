import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { communityTabs } from "@/constants";

import ProfileHeader from "@/components/Shared/ProfileHeader";
import PostTab from "@/components/Shared/PostTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchCommunityDetails,
  fetchCommunityPosts,
} from "@/lib/actions/community.actions";
import UserCard from "@/components/Cards/UserCard";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!user) return null;

  const communityPosts = await fetchCommunityPosts(params.id);

  const communityDetails = await fetchCommunityDetails(params.id);

  return (
    <section>
      <ProfileHeader
        accountId={communityDetails.createdBy.id}
        authUserId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        type="Community"
      />
      <div className="mt-9 ">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain "
                />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Posts" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {communityPosts?.post?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="posts" className="w-full text-light-1">
            <PostTab
              currentUserId={user.id}
              accountId={communityDetails.id}
              accountType="Community"
            />
          </TabsContent>

          <TabsContent value="members" className="w-full text-light-1">
            <section className="flex flex-col gap-10 mt-9 ">
              {communityDetails.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  imgUrl={member.image}
                  personType="User"
                />
              ))}
            </section>
          </TabsContent>

          <TabsContent value="requests" className="w-full text-light-1">
            <PostTab
              currentUserId={user.id}
              accountId={communityDetails.id}
              accountType="community"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default page;
