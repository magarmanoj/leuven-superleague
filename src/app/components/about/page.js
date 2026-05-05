"use client";

import "../about/about.css";
export default function AboutPage() {
    return (
        <section className="about-page">
            <div className="about-hero">
                <h1>About FC Whatever</h1>
                <p>Every football club begins with a dream. FC Whatever began with friendship.</p>
            </div>

            <div className="about-story card">
                <h2>Our Journey</h2>
                <p>
                    Long before the club had a name, a badge, or a trophy, Lopshang Gharti Magar, Anoj Magar,
                    Nishesh Man Mali, and Sachin Karki were simply friends chasing a ball together.
                    For many years, they played side by side for NB Juniors, building not only their football skills
                    but a bond that extended far beyond the pitch.
                </p>

                <p>
                    Around 2016, their time at NB Juniors came to an end. Life moved on, players went different ways,
                    and suddenly there were not enough teammates to form a squad. But the love for football never faded.
                    Instead of giving up, the circle grew wider with new friends joining the trainings.
                </p>
                <p>
                    Friends stepped in. Bishwash Rana Magar, Raju Shrestha, and others answered the call. Soon, training sessions were filled with familiar faces and new energy Ayush Gurung, Pukar Bhandari, Ayush Roka, Uttam KC, Roshan Khatri Chhetri, Hemant Gurung, Ashish KC, and Anuj Magar. What started as casual kickabouts slowly turned into something more serious.
                </p>

                <p>
                    One ordinary training day at Gebouw De Nayer, a simple idea became a defining moment:
                    if they were going to play tournaments again, they needed their own team. The name came spontaneously:
                    <strong> Whatever FC</strong>. It reflected who they were: friends playing for the love of the game, ready to face anything together.
                </p>

                <p>
                    In 2017, FC Whatever stepped onto the tournament stage for the first time at the Benelux Cup 2017.
                    Led by captain Bishwash Rana Magar, the team defied expectations and won the tournament, lifting
                    their first trophy in their very first official appearance. That victory marked the beginning of a journey.
                </p>

                <p>
                    Over the years, many players have come and gone, each leaving their footprint on the club’s story. Through highs and lows, wins and losses, the heart of FC Whatever has remained the same. As of 2025, the original core Lopshang Gharti Magar, Anoj Magar, Nishesh Man Mali, Ayush Gurung, Bishwash Rana Magar, and Raju Shrestha continue to carry the spirit of the club forward.
                </p>
                <p>
                    <strong>FC Whatever is more than a football team.<br></br>
                        It is friendship.<br></br>
                        It is loyalty.<br></br>
                        It is football played with heart.</strong>
                </p>
            </div>



            <div className="about-motto card">
                <h2>Club Motto</h2>
                <p><em>“Play with Heart. Stand Together. Whatever It Takes.”</em></p>
            </div>

            <div className="about-values card">
                <h2>Our Values</h2>
                <ul>
                    <li>🤝 <strong>Brotherhood:</strong> We are teammates on the pitch and family off it. Respect, unity, and trust come first.</li>
                    <li>⚽ <strong>Passion for Football:</strong> We play because we love the game—not for fame, but for joy.</li>
                    <li>💪 <strong>Commitment:</strong> Win or lose, we show up, work hard, and give everything.</li>
                    <li>🔥 <strong>Fearless Spirit:</strong> No matter the opponent or situation, we face challenges together.</li>
                    <li>🕊️ <strong>Humility:</strong> Success never changes who we are. We stay grounded and respectful.</li>
                </ul>
            </div>

            <div className="about-timeline card">
                <h2>Club Timeline</h2>
                <ul>
                    <li><strong>2016:</strong> Core players depart from NB Juniors, informal trainings begin.</li>
                    <li><strong>2017:</strong> FC Whatever officially formed, Club name created after training at Gebouw De Nayer, first tournament: Benelux Cup 2017 🏆 Champions under captain Bishwash Rana Magar.</li>
                    <li><strong>2018–2024:</strong> Club grows with new players, strong local tournament presence.</li>
                    <li><strong>2025–Present:</strong> Original core members still leading, passion and unity continue.</li>
                </ul>
            </div>
        </section>
    );
}
