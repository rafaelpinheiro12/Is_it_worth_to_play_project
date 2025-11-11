import "../Home.css";

function MainPage() {
  return (
    <div>
      <section className="title_card">
        <h1>Is it worth to play?</h1>
        <p>The simplest way to decide what to play next.</p>
      </section>

      <section className="home_text">
        <h2>How to use</h2>
        <p>
          Type a game name in the search bar. Click a suggestion, and we’ll show a concise verdict with
          time to beat, critic and player sentiment, platform preferences, and pricing.
        </p>
        <p>If you find any issues, please send us feedback.</p>
      </section>

      <section className="home_text">
        <h2>Learn more</h2>
        <p>
          For more details, visit the <a href="/aboutus">About Us</a> page.
        </p>
      </section>
    </div>
  );
}

export default MainPage;
