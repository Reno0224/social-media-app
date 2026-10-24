import { UserListPage } from "@/components/features/user-list-page";

export default function MyFollowingPage() {
  return (
    <UserListPage
      title="Following"
      source={{ kind: "my-following" }}
      emptyTitle="Not following anyone yet"
      emptyDescription="Find people to follow and they will show up here."
    />
  );
}
