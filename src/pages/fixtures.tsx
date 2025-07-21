import { useEffect, useState } from "react";
import { format } from "date-fns";

interface Fixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
}

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  useEffect(() => {
    fetch("/api/fixtures")
      .then((res) => res.json())
      .then(setFixtures)
      .catch((err) => console.error("Error fetching fixtures:", err));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Fixtures</h1>
      {fixtures.length === 0 ? (
        <p>No fixtures found.</p>
      ) : (
        <ul className="space-y-2">
          {fixtures.map((fixture) => {
            let formattedDate = "Invalid date";
            try {
              formattedDate = format(new Date(fixture.matchDate), "eeee do MMMM, yyyy h:mm a");
            } catch (e) {
              console.error("Date parsing error:", e, fixture,matchDate);
            }

            return (
              <li key={fixture.id} className="p-4 border rounded shadow-sm">
                <div className="font-semibold">
                  {fixture.homeTeam} vs {fixture.awayTeam}
                </div>
                <div className="text-sm text-gray-600">{formattedDate}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
