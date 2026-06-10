import ConceptMastery from "./ConceptMastery";
import ProgressSummary from "./ProgressSummary";

const UserProgress = () => {
  return (
    <div className="space-y-8">
      <ProgressSummary />
      <ConceptMastery />
    </div>
  );
};

export default UserProgress;
