import "../Home.css";

function MainPage() {
  return (
    <div>
      <div className="title_card">
        <h1>Is it worth to play?</h1>
        <p>The app that will help you decide whether to play a game or not</p>
      </div>
      <div className="home_text">
        <h2>How to use</h2>
        <p>
          Just enter the game name in the search bar, click on the suggestion
          <br /> and the app will give you the answer
        </p>
        <text>If how find any issues, please send us some feedback</text>
      </div>
      <div className="home_text">
        <p>
          For more information visit the <a href="/aboutus">ABOUT US</a> page
        </p>
      </div>
    </div>
  );
}

export default MainPage;
