"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Fixture = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
};


export default function FixturesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [fixtures, setFixtures] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [editing, setEditing] = useState({}); // track editing state per fixture

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/auth"); // redirect if not logged in
      } else {
        setUser(data.user);
      }
    };

    fetchSession();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      const fixturesRes = await fetch("/api/fixtures");
      const fixturesData = await fixturesRes.json();
      setFixtures(fixturesData);

      const predictionsRes = await fetch(`/api/predictions?userId=test-user-id`);
      const predictionsData = await predictionsRes.json();

      const mapped = predictionsData.reduce((acc, p) => {
        acc[p.fixtureId] = { homeScore: p.homeScore, awayScore: p.awayScore };
        return acc;
      }, {});
      setPredictions(mapped);
    };

    fetchData();
  }, []);

  const handleSave = async (fixtureId, homeScore, awayScore) => {
    const res = await fetch("/api/predictions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "test-user-id",
        predictions: [{ fixtureId, homeScore, awayScore }],
      }),
    });

    const data = await res.json();
    console.log(data);

    setPredictions({
      ...predictions,
      [fixtureId]: { homeScore, awayScore },
    });
    setEditing({ ...editing, [fixtureId]: false });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Fixtures and Predictions</h2>
      <table className="min-w-full bg-white border rounded">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Fixture</th>
            <th className="py-2 px-4 border">Your Prediction</th>
          </tr>
        </thead>
        <tbody>
          {fixtures.map((fixture) => {
            const existing = predictions[fixture.id];
            const isEditing = editing[fixture.id] || !existing;

            return (
              <tr key={fixture.id} className="border-t">
                <td className="py-2 px-4">
                  <div className="font-semibold">
                    {fixture.homeTeam} vs {fixture.awayTeam}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(fixture.matchDate).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                </td>
                <td className="py-2 px-4">
                  {isEditing ? (
                    <div className="flex space-x-2 items-center">
                      <input
                        type="number"
                        placeholder="Home"
                        defaultValue={existing ? existing.homeScore : ""}
                        id={`${fixture.id}-homeScore`}
                        className="border px-2 py-1 rounded w-16"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        placeholder="Away"
                        defaultValue={existing ? existing.awayScore : ""}
                        id={`${fixture.id}-awayScore`}
                        className="border px-2 py-1 rounded w-16"
                      />
                      <button
                        onClick={() =>
                          handleSave(
                            fixture.id,
                            Number((document.getElementById(`${fixture.id}-homeScore`) as HTMLInputElement).value),
                            Number((document.getElementById(`${fixture.id}-awayScore`) as HTMLInputElement).value),
                          )
                        }
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>
                        {existing.homeScore} - {existing.awayScore}
                      </span>
                      <button
                        onClick={() => setEditing({ ...editing, [fixture.id]: true })}
                        className="text-blue-600 underline"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
