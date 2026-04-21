# 2D Cricket Web Application - Project Report

**Name:** Asad Khurshid  
**Roll Number:** 22i-1585  
**Section:** C  

---

## Table of Contents

1. [Screenshots of Gameplay](#screenshots-of-gameplay)
2. [Game Logic and Working Mechanism](#game-logic-and-working-mechanism)
3. [Mapping of Probabilities to the Power Bar](#mapping-of-probabilities-to-the-power-bar)
4. [Implementation of Animations](#implementation-of-animations)

---

## Screenshots of Gameplay

> **Note:** Each screenshot must include a visible sticky note displaying Name, Roll Number, and Section.

### Screenshot 1: Aggressive Batting in Action

<!-- Insert screenshot here showing aggressive batting mode selected, ball being bowled, batsman swinging, and power bar visible -->

```
[PLACEHOLDER: Screenshot - Aggressive Batting in Action]
Include sticky note with Name, Roll Number, and Section visible in the screenshot.
```

**What to capture:** The game running with "Aggressive" radio button selected, showing the batting animation mid-swing while a ball is being bowled. The power bar should be visible with the aggressive probability distribution (larger 6-run and wicket segments).

---

### Screenshot 2: Defensive Batting in Action

<!-- Insert screenshot here showing defensive batting mode selected with visible gameplay -->

```
[PLACEHOLDER: Screenshot - Defensive Batting in Action]
Include sticky note with Name, Roll Number, and Section visible in the screenshot.
```

**What to capture:** The game running with "Defensive" radio button selected, showing the batting animation. The power bar should reflect defensive probabilities (larger 0 and 1-run segments, smaller wicket and 6-run segments).

---

### Screenshot 3: Power Bar Visible During Gameplay

<!-- Insert screenshot here showing the full power bar with probability segments and slider indicator -->

```
[PLACEHOLDER: Screenshot - Power Bar Visible During Gameplay]
Include sticky note with Name, Roll Number, and Section visible in the screenshot.
```

**What to capture:** A clear view of the power bar showing all colored segments (Wicket, 0, 1, 2, 3, 4, 6) with their labels and the slider indicator arrow (▼) positioned along the bar.

---

### Screenshot 4: Scoreboard Updates Reflecting Game Progress

<!-- Insert screenshot here showing the scoreboard with runs, wickets, overs, and balls left after several deliveries -->

```
[PLACEHOLDER: Screenshot - Scoreboard Updates Reflecting Game Progress]
Include sticky note with Name, Roll Number, and Section visible in the screenshot.
```

**What to capture:** The scoreboard showing updated values after multiple deliveries have been played. Display Score (e.g., 24/1), Overs (e.g., 1.3 / 2.0), and Balls Left (e.g., 7). Include the commentary box with the latest result message.

---

### Screenshot 5: Game Over Screen

<!-- Insert screenshot here showing the game over modal with final score -->

```
[PLACEHOLDER: Screenshot - Game Over Screen]
Include sticky note with Name, Roll Number, and Section visible in the screenshot.
```

**What to capture:** The full-screen game over modal overlay displaying "Game Over!", Final Score (e.g., 35/2), Result showing overs played, and the "Restart Match" button.

---

## Game Logic and Working Mechanism

### Overview

The 2D Cricket Web Application is a probability-based cricket batting simulator built with React. The player acts as a batsman who faces a fixed number of deliveries (12 balls across 2 overs) and can choose between two batting strategies: **Aggressive** or **Defensive**.

### Game Flow

1. **Initialization:** The game starts in the `playing` state with 0 runs, 0 wickets, and 0 balls played. The power bar slider begins animating automatically from left to right.

2. **Batting Strategy Selection:** The player selects either "Aggressive" or "Defensive" using radio buttons. This choice determines the probability distribution used for each outcome.

3. **Shot Execution:** When the player clicks the "Play Shot" button, the current slider position (a value between 0 and 100) is captured. This position is converted to a fractional value (0 to 1) and compared against the cumulative probabilities of the selected strategy to determine the outcome.

4. **Outcome Resolution:** Based on the slider position, the game resolves the delivery into one of seven outcomes: Wicket, 0, 1, 2, 3, 4, or 6 runs. The runs are added to the total, and if it is a wicket, the wicket count increments.

5. **Game Termination:** The game ends when either:
   - All 12 balls (2 overs) have been bowled, OR
   - 2 wickets have fallen (all batsmen out)
   
   A game over modal displays the final score.

6. **Restart:** The player can restart the match at any point using the "Restart" or "Restart Match" button, which resets all state variables to their initial values.

### Key State Variables

| Variable | Purpose |
|----------|---------|
| `runs` | Total runs scored by the batsman |
| `wickets` | Number of wickets fallen (max 2) |
| `balls` | Number of balls delivered (max 12) |
| `battingStyle` | Current strategy: `"aggressive"` or `"defensive"` |
| `gameState` | Either `"playing"` or `"gameover"` |
| `commentary` | Text displayed in the commentary box |
| `isBowling` | Controls the bowling animation trigger |
| `isBatting` | Controls the batting swing animation trigger |

### Outcome Determination Algorithm

```javascript
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
```

The slider position acts as a random number proxy. Since the slider moves continuously and the player must time their click, the position at the moment of clicking simulates randomness. The cumulative probability distribution maps this position to a specific outcome.

---

## Mapping of Probabilities to the Power Bar

### Aggressive Batting Probabilities

| Outcome | Probability | Color | Rationale |
|---------|-------------|-------|-----------|
| Wicket | 40% | Red (#d32f2f) | High risk of losing wicket |
| 0 | 10% | Grey (#757575) | Small chance of dot ball |
| 1 | 10% | Green (#4caf50) | Small chance of single |
| 2 | 10% | Yellow (#ffeb3b) | Small chance of double |
| 3 | 5% | Orange (#ff9800) | Rare three runs |
| 4 | 10% | Blue (#2196f3) | Decent chance of boundary |
| 6 | 15% | Purple (#9c27b0) | Higher chance of maximum |

**Total: 100%**

### Defensive Batting Probabilities

| Outcome | Probability | Color | Rationale |
|---------|-------------|-------|-----------|
| Wicket | 10% | Red (#d32f2f) | Low risk of losing wicket |
| 0 | 30% | Grey (#757575) | High chance of dot ball |
| 1 | 30% | Green (#4caf50) | High chance of single |
| 2 | 15% | Yellow (#ffeb3b) | Moderate chance of double |
| 3 | 5% | Orange (#ff9800) | Rare three runs |
| 4 | 8% | Blue (#2196f3) | Small chance of boundary |
| 6 | 2% | Purple (#9c27b0) | Very rare maximum |

**Total: 100%**

### Visual Power Bar Implementation

The power bar is rendered as a horizontal `div` containing colored segments. Each segment's width is proportional to its probability:

```jsx
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
```

- Each segment's `width` is set to `chance * 100` percentage of the total bar.
- The `backgroundColor` is assigned from the probability data.
- The slider arrow (▼) overlays the bar and its `left` CSS property is updated via `requestAnimationFrame` for smooth movement.

### Comparison Summary

```
Aggressive:  [████Wicket████][0][1][2][3][██4██][████6████]
              40%            10 10 10 5  10%    15%

Defensive:   [█Wicket█][████████0████████][████████1████████][██2██][3][█4█][6]
              10%       30%               30%                15%   5  8%   2%
```

The aggressive mode favors high-reward outcomes (4s and 6s) but carries a 40% wicket risk. The defensive mode prioritizes safe singles and dot balls with only a 10% wicket risk.

---

## Implementation of Animations

### 1. Power Bar Slider Animation

The slider indicator moves continuously across the power bar using the browser's `requestAnimationFrame` API for smooth 60fps animation.

```javascript
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
```

- **Mechanism:** The slider bounces between 0% and 100% using a direction flag (`dirRef`). When it hits a boundary, the direction reverses.
- **Delta Time:** The animation uses `performance.now()` to calculate frame delta, ensuring consistent speed regardless of frame rate.
- **Direct DOM Manipulation:** The `left` style property is set directly via a ref (`sliderRef`) to avoid React re-renders on every frame, keeping the animation performant.

### 2. Bowling Animation

The ball travels from the bowler's end to the batsman using a CSS `@keyframes` animation.

```css
.bowling-action {
  animation: bowl 0.5s ease-in forwards;
  opacity: 1;
}

@keyframes bowl {
  0%   { top: 10px;  transform: scale(0.8) translateX(-50%); }
  100% { top: 220px; transform: scale(1.2) translateX(-50%); }
}
```

- **Trigger:** Adding the `bowling-action` class to the ball element when `isBowling` state is `true`.
- **Effect:** The ball starts small at the top (bowler's end) and grows larger as it travels down toward the batsman, simulating perspective/depth.
- **Duration:** 0.5 seconds with `ease-in` timing for a realistic acceleration effect.
- **Cleanup:** After the animation completes (via `setTimeout` of 500ms), the batting animation triggers and the bowling state resets.

### 3. Batting Swing Animation

The batsman's bat swings from a resting position to a striking position using CSS transitions.

```css
.bat {
  transform: rotate(15deg);
  transition: transform 0.2s;
  transform-origin: top left;
}

.swinging .bat {
  transform: rotate(-80deg);
  transition: transform 0.1s;
}
```

- **Rest Position:** The bat is angled at 15 degrees (ready stance).
- **Swing Position:** When the `swinging` class is applied (via `isBatting` state), the bat rotates to -80 degrees, simulating a shot.
- **Transform Origin:** Set to `top left` so the bat pivots from the handle, mimicking a natural batting motion.
- **Timing:** The swing is fast (0.1s) compared to the return (0.2s), giving a snappy hitting feel.
- **Duration:** The `isBatting` state remains `true` for 300ms before resetting, allowing the full swing and return animation.

### 4. Sound Effects (Audio Feedback)

Sound effects complement the visual animations using the Web Audio API:

| Event | Sound | Implementation |
|-------|-------|----------------|
| Normal hit | Short 600Hz triangle tone | `playTone(600, 'triangle', 0.1, 0.4)` |
| Six hit | Ascending 3-note sequence (400→500→600Hz square wave) | Three timed `playTone` calls |
| Wicket | Descending 3-note sequence (300→250→200Hz sawtooth wave) | Three timed `playTone` calls |

The sound engine initializes on first user interaction to comply with browser autoplay policies.

### 5. Game Over Modal

The game over screen uses a fixed-position overlay with CSS:

```css
.game-over-modal {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.6);
  z-index: 100;
  color: white;
}
```

- **Conditional Rendering:** Only mounted when `gameState === "gameover"` using React's conditional rendering.
- **Overlay:** Semi-transparent dark background covers the entire viewport.
- **Content:** Displays final score, overs played, and a restart button.

---

## Technology Stack

- **Framework:** React 19 with Vite
- **Language:** JavaScript (JSX)
- **Styling:** Plain CSS with keyframe animations
- **Audio:** Web Audio API for procedural sound generation
- **State Management:** React `useState` and `useRef` hooks

---

## Conclusion

The 2D Cricket Web Application demonstrates a complete probability-based game with interactive animations, real-time state management, and audio feedback. The dual batting strategies (Aggressive vs Defensive) provide different risk-reward trade-offs, while the power bar slider mechanic adds a timing skill element to the gameplay. All animations are implemented using CSS keyframes and `requestAnimationFrame` for smooth, performant visuals.

---

*Report prepared by: Asad Khurshid (22i-1585, Section C)*
