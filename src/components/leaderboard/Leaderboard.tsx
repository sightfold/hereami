"use client";

import { useState } from "react";
import MyStanding from "@/components/leaderboard/MyStanding";
import PodiumCard from "@/components/leaderboard/PodiumCard";
import PointRules from "@/components/leaderboard/PointRules";
import RankRow from "@/components/leaderboard/RankRow";
import Segmented from "@/components/ui/Segmented";
import { useAppSelector } from "@/store";
import {
  selectCurrentUser,
  selectRecords,
  selectServices,
  selectToday,
  selectUsers,
} from "@/store/selectors";
import { rankStandings, servicesIn, type Period } from "@/utils/points";

const periods: { value: Period; label: string }[] = [
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
];

const Leaderboard = () => {
  const me = useAppSelector(selectCurrentUser);
  const users = useAppSelector(selectUsers);
  const services = useAppSelector(selectServices);
  const records = useAppSelector(selectRecords);
  const [period, setPeriod] = useState<Period>("week");

  const today = useAppSelector(selectToday);
  const standings = rankStandings(users, servicesIn(services, period, today), records, today);
  const myStanding = standings.find((standing) => standing.user.id === me?.id);
  const isMe = (userId: string) => userId === me?.id;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-[#2b1408] via-[#140a06] to-[#0a0705] px-4 py-6 text-white sm:px-8 sm:py-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-48 mx-auto h-96 max-w-2xl rounded-full bg-orange-600/40 blur-3xl"
        />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <PointRules />
            <Segmented
              label="Period"
              tone="gold"
              value={period}
              options={periods}
              onChange={setPeriod}
            />
          </div>
          <div className="mt-2 text-center">
            <p className="text-sm font-semibold tracking-[0.3em] text-orange-400">ATTENDANCE</p>
            <h1 className="bg-linear-to-b from-amber-100 via-amber-300 to-orange-500 bg-clip-text font-display text-5xl leading-tight tracking-wide text-transparent sm:text-7xl">
              TOP PERFORMERS
            </h1>
            <p className="text-sm font-semibold tracking-[0.3em] text-orange-400">
              OF THE {period === "week" ? "WEEK" : "MONTH"}
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:mt-12 md:grid-cols-3 md:items-end">
            {standings.slice(0, 3).map((standing) => (
              <PodiumCard
                key={standing.user.id}
                standing={standing}
                isMe={isMe(standing.user.id)}
              />
            ))}
          </div>
          <ol className="mt-6 flex flex-col gap-2">
            {standings.slice(3).map((standing) => (
              <RankRow key={standing.user.id} standing={standing} isMe={isMe(standing.user.id)} />
            ))}
          </ol>
        </div>
      </section>
      {myStanding && <MyStanding standing={myStanding} />}
    </div>
  );
};

export default Leaderboard;
