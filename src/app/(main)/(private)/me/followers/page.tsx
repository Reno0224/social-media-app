import { UserListPage } from "@/components/features/user-list-page";

export default function MyFollowersPage() {
  return (
    <UserListPage
      title="Followers"
      source={{ kind: "my-followers" }}
      emptyTitle="No followers yet"
      emptyDescription="When people follow you, they will show up here."
    />
  );
}
