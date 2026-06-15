import DashboardLayout from "../components/DashboardLayout";
import StoriesSection from "../components/StoriesSection";
import CreatePost from "../components/CreatePost";
import Feed from "../components/Feed";

function Profile() {
  return (
    <DashboardLayout>
      <StoriesSection />

      <CreatePost />

      <Feed />
    </DashboardLayout>
  );
}

export default Profile;
