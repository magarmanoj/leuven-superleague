"use client";
import { TeamsProvider } from "./teamsContext";
import { TablesProvider } from "./tableContext";
import { MatchesProvider } from "./matchesContext";
import { StatisticsProvider } from "./statisticsContext";
import { AuthProvider } from "./authContext";
import { NewsProvider } from "./newsContext";
import { EventProvider } from "./eventContext";

export default function AppProvider({ children }) {
    return (
        <AuthProvider>
            <TeamsProvider>
                <MatchesProvider>
                    <TablesProvider>
                        <StatisticsProvider>
                            <NewsProvider>
                                <EventProvider>
                                    {children}
                                </EventProvider>
                            </NewsProvider>
                        </StatisticsProvider>
                    </TablesProvider>
                </MatchesProvider >
            </TeamsProvider>
        </AuthProvider>
    );
}
