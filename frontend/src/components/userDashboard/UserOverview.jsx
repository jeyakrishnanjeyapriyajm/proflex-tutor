import StudentTopbar from "./StudentTopbar";
import ProgressSummary from "./ProgressSummary";
import ConceptMastery from "./ConceptMastery";
import RecentActivity from "./RecentActivity";
import ResumeLearningCard from "./ResumeLearningCard";
import LatestResources from "./LatestResources";
import RecentMessages from "./RecentMessages";
import Achievements from "./Achievements";

const UserOverview = ({ data }) => {
  const user = data?.user;
  const dashboard = data?.dashboard;

  return (
    <div className="space-y-8">
      <StudentTopbar user={user} dashboard={dashboard} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <ProgressSummary dashboard={dashboard} />
          <ConceptMastery items={dashboard?.conceptMastery || []} />
          <RecentActivity items={dashboard?.recentActivities || []} />
        </div>

        <div className="space-y-8 lg:col-span-4">
          <ResumeLearningCard />
          <LatestResources items={dashboard?.resources || []} />
          <RecentMessages items={dashboard?.messages || []} />
          <Achievements items={dashboard?.achievements || []} />
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
