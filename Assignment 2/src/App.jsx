import { useState, useEffect, useRef } from "react";
import "./App.css";

// --- Probability Data ---
const PROBABILITIES = {
  aggressive: [
    { label: "Wicket", chance: 0.40, runs: 0, isWicket: true, color: "#d32f2f" },
    { label: "0", chance: 0.10, runs: 0, isWicket: false, color: "#757575" },
    { label: "1", chance: 0.10, runs: 1, isWicket: false, color: "#4caf50" },
    { label: "2", chance: 0.10, runs: 2, isWicket: false, color: "#ffeb3b" },
    { label: "3", chance: 0.05, runs: 3, isWicket: false, color: "#ff9800" },
    { label: "4", chance: 0.10, runs: 4, isWicket: false, color: "#2196f3" },
    { label: "6", chance: 0.15, runs: 6, isWicket: false, color: "#9c27b0" },
  ],
  defensive: [
    { label: "Wicket", chance: 0.10, runs: 0, isWicket: true, color: "#d32f2f" },
    { label: "0", chance: 0.30, runs: 0, isWicket: false, color: "#757575" },
    { label: "1", chance: 0.30, runs: 1, isWicket: false, color: "#4caf50" },
    { label: "2", chance: 0.15, runs: 2, isWicket: false, color: "#ffeb3b" },
    { label: "3", chance: 0.05, runs: 3, isWicket: false, color: "#ff9800" },
    { label: "4", chance: 0.08, runs: 4, isWicket: false, color: "#2196f3" },
    { label: "6", chance: 0.02, runs: 6, isWicket: false, color: "#9c27b0" },
  ],
};

const MAX_OVERS = 2; // 2 overs = 12 balls
const BALLS_PER_OVER = 6;
const MAX_WICKETS = 2;
const MAX_BALLS = MAX_OVERS * BALLS_PER_OVER;

const DEFAULT_COMMENTARY = [
  "Welcome to the game! Ready to bat?",
];

const OUTCOME_MESSAGES = {
  "Wicket": ["Oh no! He's out!", "Clean bowled!", "Caught in the deep!"],
  "0": ["Defended well.", "Dot ball.", "Straight to the fielder."],
  "1": ["Just nudged it for a single.", "Quick single taken.", "Good running between the wickets."],
  "2": ["Pushed in the gap for two.", "Good running, completes 2 runs.", "Double taken easily."],
  "3": ["Great running for three!", "Saves the boundary but gives three."],
  "4": ["What a shot! It races to the boundary for four!", "Beautiful drive for Four!", "Smashed for Four!"],
  "6": ["Huge! That's a massive Six!", "Out of the park! Six runs!", "Maximum!"],
};

// --- Sound Effects using Web Audio API ---
const SoundEngine = {
  ctx: null,
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume context if suspended (browser security)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },
  playTone(frequency, type, duration, vol=0.5) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },
  playHit() {
    this.init();
    this.playTone(600, 'triangle', 0.1, 0.4);
  },
  playSix() {
    this.init();
    // Triumphant ascending sequence
    this.playTone(400, 'square', 0.15, 0.3);
    setTimeout(() => this.playTone(500, 'square', 0.15, 0.3), 150);
    setTimeout(() => this.playTone(600, 'square', 0.4, 0.3), 300);
  },
  playOut() {
    this.init();
    // Sad descending sequence
    this.playTone(300, 'sawtooth', 0.2, 0.4);
    setTimeout(() => this.playTone(250, 'sawtooth', 0.2, 0.4), 200);
    setTimeout(() => this.playTone(200, 'sawtooth', 0.6, 0.4), 400);
  }
};

export default function App() {
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0);
  const [battingStyle, setBattingStyle] = useState("aggressive");
  const [gameState, setGameState] = useState("playing");
  const [commentary, setCommentary] = useState(DEFAULT_COMMENTARY[0]);
  
  const sliderRef = useRef(null);
  const reqRef = useRef(null);
  const posRef = useRef(0);
  const dirRef = useRef(1);
  const [isBowling, setIsBowling] = useState(false);
  const [isBatting, setIsBatting] = useState(false);

  const startSlider = () => {
    let lastTime = performance.now();
    const speed = 0.08;

    const animate = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      posRef.current += dirRef.current * speed * delta;
      
      if (posRef.current >= 100) {
        posRef.current = 100;
        dirRef.current = -1;
      } else if (posRef.current <= 0) {
        posRef.current = 0;
        dirRef.current = 1;
      }

      if (sliderRef.current) {
        sliderRef.current.style.left = `${posRef.current}%`;
      }
      
      reqRef.current = requestAnimationFrame(animate);
    };
    reqRef.current = requestAnimationFrame(animate);
  };

  const stopSlider = () => {
    if (reqRef.current) {
      cancelAnimationFrame(reqRef.current);
    }
  };

  useEffect(() => {
    if (gameState === "playing") {
      startSlider();
    } else {
      stopSlider();
    }
    return () => stopSlider();
  }, [gameState, battingStyle]);
x
  const processTurnOutcome = (selectedOutcome) => {
    const newRuns = runs + selectedOutcome.runs;
    const newWickets = wickets + (selectedOutcome.isWicket ? 1 : 0);
    const newBalls = balls + 1;

    setRuns(newRuns);
    setWickets(newWickets);
    setBalls(newBalls);

    const possibleComments = OUTCOME_MESSAGES[selectedOutcome.label];
    const randomComment = possibleComments[Math.floor(Math.random() * possibleComments.length)];
    setCommentary(`Result: ${selectedOutcome.label}! ${randomComment}`);

    if (newBalls >= MAX_BALLS || newWickets >= MAX_WICKETS) {
      setGameState("gameover");
      stopSlider();
    } else {
      posRef.current = 0;
      dirRef.current = 1;
      if (sliderRef.current) sliderRef.current.style.left = "0%";
      startSlider();
    }
  };

  const playShot = () => {
    // Initialize standard user interaction to allow sounds
    SoundEngine.init();
    
    if (gameState !== "playing" || isBowling) return;

    // Calculate outcome right away based on current slider position
    const sliderFraction = posRef.current / 100;
    const currentProbs = PROBABILITIES[battingStyle];
    let cumulative = 0;
    let selectedOutcome = currentProbs[currentProbs.length - 1];

    for (let p of currentProbs) {
      cumulative += p.chance;
      if (sliderFraction <= cumulative) {
        selectedOutcome = p;
        break;
      }
    }

    setIsBowling(true);
    stopSlider();

    setTimeout(() => {
      setIsBatting(true);
      
      // Play matching sounds based on the calculated outcome
      if (selectedOutcome.isWicket) {
        SoundEngine.playOut();
      } else if (selectedOutcome.runs === 6) {
        SoundEngine.playHit();
        setTimeout(() => SoundEngine.playSix(), 150);
      } else {
        SoundEngine.playHit();
      }

      setTimeout(() => {
        setIsBatting(false);
        setIsBowling(false);
        processTurnOutcome(selectedOutcome);
      }, 300);
    }, 500);
  };

  const resetGame = () => {
    setRuns(0);
    setWickets(0);
    setBalls(0);
    setGameState("playing");
    setBattingStyle("aggressive");
    setCommentary(DEFAULT_COMMENTARY[0]);
    setIsBowling(false);
    setIsBatting(false);
    posRef.current = 0;
    if (sliderRef.current) sliderRef.current.style.left = "0%";
  };

  const oversStr = `${Math.floor(balls / 6)}.${balls % 6} / ${MAX_OVERS}.0`;
  const currentProbs = PROBABILITIES[battingStyle];

  return (
    <div className="app-container">
      <header className="header">
        <h1>2D Cricket Web Application</h1>
      </header>

      <div className="cricket-ground">
        <div className="scoreboard" style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", textAlign: "left", fontSize: "0.8rem", color: "#b2dfdb", lineHeight: "1.2" }}>
            <div>Asad Khurshid</div>
            <div>22i-1585</div>
            <div>Section C</div>
          </div>
          <div className="score-item"><h2>Score</h2><p>{runs}/{wickets}</p></div>
          <div className="score-item"><h2>Overs</h2><p>{oversStr}</p></div>
          <div className="score-item"><h2>Balls Left</h2><p>{MAX_BALLS - balls}</p></div>
          <div className="score-item" style={{ position: "absolute", right: "20px", top: "40%", transform: "translateY(-50%)" }}>
            <button 
              onClick={resetGame} 
              className="reset-btn"
              disabled={isBowling}
              style={{ backgroundColor: "#b2dfdb", color: "#004d40", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}
            >
              Restart
            </button>
          </div>
        </div>

        <div className="pitch-container">
          <div className="pitch">
            <div className={`batsman ${isBatting ? "swinging" : ""}`}>
              <div className="bat"></div>
            </div>
            
            <div className={`ball ${isBowling ? "bowling-action" : ""}`}></div>
            <div className="stump-set">
               <div className="stump"></div>
               <div className="stump"></div>
               <div className="stump"></div>
            </div>
          </div>
        </div>

        <div className="commentary-box">
          <p>🎙️ {commentary}</p>
        </div>
      </div>

      <div className="controls">
        <div className="strategy-selection">
          <label>
            <input 
              type="radio" 
              name="style" 
              value="aggressive" 
              checked={battingStyle === "aggressive"}
              onChange={(e) => setBattingStyle(e.target.value)}
              disabled={gameState !== "playing" || isBowling}
            />
            Aggressive
          </label>
          <label>
            <input 
              type="radio" 
              name="style" 
              value="defensive" 
              checked={battingStyle === "defensive"}
              onChange={(e) => setBattingStyle(e.target.value)}
              disabled={gameState !== "playing" || isBowling}
            />
            Defensive
          </label>
        </div>

        <div className="power-bar-wrapper">
          <div className="power-bar">
            {currentProbs.map((prob, i) => (
              <div 
                key={i} 
                className="power-segment" 
                style={{ width: `${prob.chance * 100}%`, backgroundColor: prob.color }}
              >
                {prob.label}
              </div>
            ))}
            <div ref={sliderRef} className="slider">▼</div>
          </div>
        </div>

        <button 
          onClick={playShot} 
          className="play-shot-btn"
          disabled={gameState !== "playing" || isBowling}
        >
          Play Shot
        </button>
      </div>

      {gameState === "gameover" && (
        <div className="game-over-modal">
          <h2>Game Over!</h2>
          <p>Final Score: {runs}/{wickets}</p>
          <p>Result: Played {oversStr} overs.</p>
          <button onClick={resetGame} className="reset-btn">Restart Match</button>
        </div>
      )}
    </div>
  );
}
