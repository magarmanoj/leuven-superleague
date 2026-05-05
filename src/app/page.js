"use client";

import "../app/home.css";
import Link from 'next/link';
import React, { useContext } from "react";
import Image from "next/image";
import { formatDistanceToNow, differenceInDays } from "date-fns";


import { MatchesContext } from "../app/Context/matchesContext";
import { TeamsContext } from "../app/Context/teamsContext";
import { TablesContext } from "../app/Context/tableContext";
import { NewsContext } from "../app/Context/newsContext";
import { EventContext } from "../app/Context/eventContext";

export default function HomePage() {
  const { matches, loading: matchesLoading } = useContext(MatchesContext);
  const { teams, loading: teamsLoading } = useContext(TeamsContext);
  const { table, loading: tableLoading } = useContext(TablesContext);
  const { news, loading: newsLoading } = useContext(NewsContext);

  const { events } = useContext(EventContext);
  const loading = matchesLoading || teamsLoading || tableLoading;

  const upcomingMatches = matches
    ?.filter((m) => m.played === false)
    ?.sort((a, b) => new Date(a.date) - new Date(b.date))
    ?.slice(0, 4);

  const latestResults = matches
    ?.filter((m) => m.played === true)
    ?.sort((a, b) => new Date(b.date) - new Date(a.date))
    ?.slice(0, 4);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  const daysLeft = (eventDate) => {
    const diff = differenceInDays(new Date(eventDate), new Date());
    return diff > 0 ? diff : 0;
  }

  return (
    <div className="homePage">
      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <h1>Local Football. Serious Passion.</h1>
          <p>Fixtures, results, standings and matchday drama.</p>

          <div className="hero-actions">
            <Link href="/components/matches">
              <button className="weekend">This Weekend</button>
            </Link>

            <Link href="/components/table">
              <button className="leagueTable">League Table</button>
            </Link>
          </div>

        </div>
      </section>

      {/* LEAGUE NEWS */}
      <section className="card highlight">
        <h2>📰 League News</h2>
        <div className="news-grid">
          {newsLoading ? (
            <p>Loading news...</p>
          ) : news.length > 0 ? (
            news.map((item) => (
              <article key={item.id}>
                <h3>{item.title}</h3>
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={200}
                    height={250}
                    className="news-image"
                    unoptimized
                  />
                )}
                <p>{item.content}</p>
                <span className="news-time">
                  {item.publishedAt
                    ? formatDistanceToNow(new Date(item.publishedAt.seconds * 1000), { addSuffix: true })
                    : "Just now"}
                </span>
                <Link href="/components/news">
                  <button className="read-more">Read more</button>
                </Link>
              </article>
            ))
          ) : (
            <p>No news available.</p>
          )}
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="card event">
        <h2>📅 Upcoming Events 2026</h2>
        {events.length === 0 ? (
          <p>No upcoming events.</p>
        ) : (
          <div className="news-grid">
            {events.map((event) => (
              <article key={event.id}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <span className="event-days">
                  {daysLeft(event.date)} day{daysLeft(event.date) !== 1 ? "s" : ""} to go
                </span>
                <Link href="/components/events">
                  <button className="read-more">Read more</button>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* UPCOMING FIXTURES */}
      <section className="card">
        <h2>⚽ Upcoming Fixtures</h2>
        <ul className="rows">
          {upcomingMatches?.map((match) => {
            const homeTeam = teams?.find((team) => team.name === match.homeTeam);
            const awayTeam = teams?.find((team) => team.name === match.awayTeam);
            return (
              <li key={match.id} className="fixture-row">
                {/* Home Team */}
                <div className="team home">
                  <Image
                    src={homeTeam?.logo || "/img/default.jpg"}
                    width={40}
                    height={40}
                    alt={homeTeam?.name || match.homeTeam}
                    className="team-logo"
                    priority
                    unoptimized
                  />
                  <span>{match.homeTeam}</span>
                </div>

                <span className="vs">vs</span>

                {/* Away Team */}
                <div className="team away">
                  <Image
                    src={awayTeam?.logo || "/img/default.jpg"}
                    width={40}
                    height={40}
                    alt={awayTeam?.name || match.awayTeam}
                    className="team-logo"
                    priority
                    unoptimized
                  />
                  <span>{match.awayTeam}</span>
                </div>

                <span className="time">
                  {formatDate(match.date)} · {match.kickoff}
                </span>
              </li>
            );
          })}
        </ul>
      </section>


      {/* LATEST RESULTS */}
      <section className="card">
        <h2>📊 Latest Results</h2>

        {latestResults?.length > 0 ? (
          <ul className="rows">
            {latestResults.map((match) => (
              <li key={match.id} className="result-row">
                {match.homeTeam} {match.homeGoals}–{match.awayGoals} {match.awayTeam}
                <span className="match-date">
                  FT · {formatDate(match.date)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-results">No matches played yet.</p>
        )}
      </section>


      {/* LEAGUE TABLE */}
      <section className="card table-card">
        <h2>🏆 League Table</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>P</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {table
              ?.sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference)
              ?.map((team, index) => (
                <tr key={team.id} className={index === 0 ? "leader" : ""}>
                  <td>{index + 1}</td>
                  <td>{team.name}</td>
                  <td>{team.played}</td>
                  <td>{team.points}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      {/* CLUBS */}
      <section className="wrap teams">
        <h2>🏟️ Clubs</h2>

        <div className="team-grid">
          {teams?.map((team) => (
            <div key={team.id} className="team-card">
              <Image
                src={team.logo || "/img/default-team.png"}
                width={80}
                height={80}
                alt={team.name}
                className="team-logo"
                priority
                unoptimized
              />
              <h3>{team.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
