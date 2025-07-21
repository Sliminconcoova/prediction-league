import { useEffect, useState } from "react";

interface Fixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
}

export default function PredictionsPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [predictions, setPredictions] = useState<{ [key: string]: { homeScore: number; awayScore: number } }>({});

  useEffect(() => {
    fetch("/api/fixtures")
      .then((res) => res.json())
      .then(setFixtures)
      .catch((err) => console.error("Error fetching fixtures:", err));
  }, []);

  const handleChange = (fixtureId: string, team: "homeScore" | "awayScore", value: string) => {
    setPredictions((prev) => ({
      ...prev,
      [fixtureId]: {
        ...prev[fixtureId],
        [team]: Number(value),
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "f563be2f-4cc6-456c-abb5-f971cdb94b75",
          predictions: Object.entries(predictions).map(([fixtureId, scores]) => ({
            fixtureId,
            homeScore: scores.homeScore,
            awayScore: scores.awayScore,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit predictions");
      alert("Predictions submitted!");
    } catch (err) {
      console.error(err);
      alert("Error submitting predictions");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Submit Your Predictions</h1>
      {fixtures.length === 0 ? (
        <p>No fixtures found.</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          {fixtures.map((fixture) => (
            <div key={fixture.id} className="border p-4 rounded shadow-sm">
              <div className="mb-2 font-semibold">
                {fixture.homeTeam} vs {fixture.awayTeam}
              </div>
              <div className="flex space-x-2 items-center">
                <input
                  type="number"
                  placeholder="Home"
                  className="border rounded p-2 w-20"
                  value={predictions[fixture.id]?.homeScore || ""}
                  onChange={(e) => handleChange(fixture.id, "homeScore", e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Away"
                  className="border rounded p-2 w-20"
                  value={predictions[fixture.id]?.awayScore || ""}
                  onChange={(e) => handleChange(fixture.id, "awayScore", e.target.value)}
                />
              </div>
            </div>
          ))}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Submit Predictions
          </button>
        </form>
      )}
    </div>
  );
}

