"use client";

import { useState } from "react";
import { Sprout } from "lucide-react";
import ChildPodium from "@/components/children/ChildPodium";
import ChildRankRow from "@/components/children/ChildRankRow";
import ClassSelect, { allClasses } from "@/components/children/ClassSelect";
import type { Place } from "@/components/leaderboard/Trophy";
import Empty from "@/components/ui/Empty";
import { presentPoints, streakCap, streakStep } from "@/constants/children";
import { useAppSelector } from "@/store";
import { selectActiveChildren, selectChildMarks, selectHeldServices } from "@/store/selectors";
import { rankChildren } from "@/utils/childScore";

const podiumSize = 3;

const podiumOrder = ["md:order-1", "md:order-0", "md:order-2"];

const ChildrenLeaderboardPage = () => {
  const children = useAppSelector(selectActiveChildren);
  const marks = useAppSelector(selectChildMarks);
  const services = useAppSelector(selectHeldServices);
  const [classId, setClassId] = useState(allClasses);

  const inClass = children.filter((child) => classId === allClasses || child.classId === classId);
  const ranked = rankChildren(inClass, services, marks);
  const podium = ranked.slice(0, podiumSize).filter((stats) => stats.points > 0);
  const rest = ranked.slice(podium.length);

  return (
    <>
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ClassSelect value={classId} onChange={setClassId} />
      </div>
      <p className="mb-4 text-xs text-muted">
        {presentPoints} points for each service attended, plus {streakStep} for every service in a
        streak, up to {streakCap} extra.
      </p>
      {ranked.length === 0 && <Empty icon={Sprout} text="No children in this class yet." />}
      {podium.length > 0 && (
        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {podium.map((stats, index) => (
            <div key={stats.child.id} className={podiumOrder[index]}>
              <ChildPodium stats={stats} place={(index + 1) as Place} />
            </div>
          ))}
        </div>
      )}
      {rest.length > 0 && (
        <ol className="divide-y divide-line rounded-2xl border border-line bg-card">
          {rest.map((stats, index) => (
            <ChildRankRow key={stats.child.id} stats={stats} rank={podium.length + index + 1} />
          ))}
        </ol>
      )}
    </>
  );
};

export default ChildrenLeaderboardPage;
