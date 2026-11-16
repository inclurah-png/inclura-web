import Profile from "./Profile";

/*
 * Dashboard is kept as the stable dashboard entry point.
 * Profile is the existing, fully connected dashboard surface
 * (profile header, stats, stories, post creation and feed).
 */
export default function Dashboard() {
  return <Profile />;
}
