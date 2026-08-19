import { useState, useEffect, useCallback, type CSSProperties } from "react";
import ProtectedImage from "@/components/ProtectedImage";
import photo01 from "@/imports/IMG-20260702-WA0034.jpg";
import photo02 from "@/imports/IMG-20260702-WA0050.jpg";
import photo03 from "@/imports/IMG-20260702-WA0067.jpg";
import photo04 from "@/imports/IMG-20260707-WA0003.jpg";
import photo05 from "@/imports/IMG-20260710-WA0011.jpg";
import photo06 from "@/imports/IMG_20260730_152309.jpg";
import photo07 from "@/imports/Messenger_creation_874763100952795.jpeg";
import photo08 from "@/imports/Messenger_creation_1027833811890359.jpeg";

type Card = {
  id: number;
  pairId: number;
  src: string;
  flipped: boolean;
  matched: boolean;
};

type Question = {
  question: string;
  correct: string;
  shuffledOptions: string[];
};

const photos = [photo01, photo02, photo03, photo04, photo05, photo06, photo07, photo08];

const flirtyWins = [
  "You remembered every single piece of us. Of course you did, my love! 💗",
  "Match made in heaven, just like us.",
  "Your memory is as sweet as your smile, beb.",
  "You found all of us. I’m not surprised.",
  "Every piece fits perfectly — just like you and me.",
  "You know every corner of my heart.",
];

const correctReplies = [
  "Yes! You know me so well, beb. 💗",
  "That’s my favourite answer!",
  "Spot on, as always, sanu.",
  "Of course you got it right! 🥰",
  "You make it look so easy, beb.",
];

const wrongReplies = [
  "Almost, beb — try again? 🥺",
  "Not quite, but I still love you so much.",
  "Close, but not the one I was thinking of.",
  "Nah, but your guess made me smile.",
  "Try one more time, sanu!",
];

const rawQuestions = [
  {
    question: "Where did our story officially begin?",
    options: [
      "At a café",
      "In a deep and warm conversation",
      "Random text online",
      "At a party"
    ],
    correct: "In a deep and warm conversation",
  },
  {
    question: "What's the one thing I can never say no to you about?",
    options: [
      "Late night sleep",
      "Anything for you — there's no 'no' option",
      "Following strict rules",
      "Staying silent"
    ],
    correct: "Anything for you — there's no 'no' option",
  },
  {
    question: "What's our inside nickname that no one else gets?",
    options: [
      "Dalli and Bampudke",
      "Beb and Sanu",
      "Puku and Chuku",
      "Mr and Mrs"
    ],
    correct: "Dalli and Bampudke",
  },
  {
    question: "What do I love most about our time together?",
    options: [
      "Only Sunday dates",
      "Not only on Sunday — every day, every night being in your warmth",
      "Going to fancy restaurants",
      "Talking only on holidays"
    ],
    correct: "Not only on Sunday — every day, every night being in your warmth",
  },
  {
    question: "If we could teleport anywhere right now, where would I take you?",
    options: [
      "A crowded beach",
      "Somewhere there is only us and beautiful nature, no network tower",
      "A loud city center",
      "A big luxury mall"
    ],
    correct: "Somewhere there is only us and beautiful nature, no network tower",
  },
  {
    question: "What's the first thing I noticed & fell in love with about you?",
    options: [
      "Your smile",
      "Your eyes",
      "Your kindness",
      "Everything"
    ],
    correct: "Everything",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function prepareQuizQuestions(): Question[] {
  return rawQuestions.map((q) => ({
    question: q.question,
    correct: q.correct,
    shuffledOptions: shuffle([...q.options]),
  }));
}

function generateDeck(): Card[] {
  const rawCards = photos.flatMap((src, i) => [
    {
      id: i * 2,
      pairId: i,
      src,
      flipped: false,
      matched: false,
    },
    {
      id: i * 2 + 1,
      pairId: i,
      src,
      flipped: false,
      matched: false,
    },
  ]);
  return shuffle(rawCards);
}

export default function GamesSection() {
  const [tab, setTab] = useState<"match" | "quiz">("match");
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState(0);
  const [matchWon, setMatchWon] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    setCards(generateDeck());
    setQuizQuestions(prepareQuizQuestions());
  }, []);

  const handleFlip = useCallback(
    (id: number) => {
      if (flipped.length === 2) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.flipped || card.matched) return;

      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
      );
      setFlipped((prev) => [...prev, id]);
    },
    [cards, flipped]
  );

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    const cardA = cards.find((c) => c.id === a);
    const cardB = cards.find((c) => c.id === b);
    if (!cardA || !cardB) return;

    setMoves((m) => m + 1);

    if (cardA.pairId === cardB.pairId) {
      setCards((prev) =>
        prev.map((c) =>
          c.pairId === cardA.pairId ? { ...c, matched: true } : c
        )
      );
      setMatchedPairs((p) => {
        const next = p + 1;
        if (next === photos.length) {
          setMatchWon(true);
        }
        return next;
      });
      setFlipped([]);
    } else {
      const timer = window.setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === a || c.id === b ? { ...c, flipped: false } : c
          )
        );
        setFlipped([]);
      }, 800);
      return () => window.clearTimeout(timer);
    }
  }, [flipped, cards]);

  const resetMatch = () => {
    setCards(generateDeck());
    setFlipped([]);
    setMatchedPairs(0);
    setMoves(0);
    setMatchWon(false);
  };

  const handleQuizAnswer = (answer: string) => {
    if (!quizQuestions[quizIndex]) return;
    const isCorrect = answer === quizQuestions[quizIndex].correct;
    if (isCorrect) setQuizScore((s) => s + 1);
    setQuizFeedback(
      isCorrect
        ? correctReplies[Math.floor(Math.random() * correctReplies.length)]
        : wrongReplies[Math.floor(Math.random() * wrongReplies.length)]
    );

    const timer = window.setTimeout(() => {
      setQuizFeedback(null);
      if (quizIndex + 1 < quizQuestions.length) {
        setQuizIndex((i) => i + 1);
      } else {
        setQuizDone(true);
      }
    }, 1400);
    return () => window.clearTimeout(timer);
  };

  const resetQuiz = () => {
    setQuizQuestions(prepareQuizQuestions());
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFeedback(null);
    setQuizDone(false);
  };

  const currentQ = quizQuestions[quizIndex];

  return (
    <section id="games" className="scroll-section games">
      <div className="section-heading">
        <p className="eyebrow">just for us</p>
        <h2>Little Games,<br /><em>Big Love.</em></h2>
        <p className="games-intro">
          Play with me — because every love story deserves a little fun.
        </p>
      </div>

      <div className="games-toggle">
        <button
          className={tab === "match" ? "active" : ""}
          onClick={() => setTab("match")}
        >
          ♥ Memory Match
        </button>
        <button
          className={tab === "quiz" ? "active" : ""}
          onClick={() => setTab("quiz")}
        >
          ♥ Love Quiz
        </button>
      </div>

      <div className="games-stage">
        {tab === "match" && (
          <div className="memory-match">
            {matchWon ? (
              <div className="match-win romantic-celebration">
                <div className="celebration-particles" aria-hidden="true">
                  {Array.from({ length: 8 }, (_, i) => (
                    <span key={i} className="c-heart" style={{ "--ci": i } as CSSProperties}>💗</span>
                  ))}
                </div>
                <div className="celebration-badge">🌸 💖 🌸</div>
                <p className="match-win-title">You found every piece of us!</p>
                <p className="match-win-sub">
                  {flirtyWins[Math.floor(Math.random() * flirtyWins.length)]}
                </p>
                <div className="match-stats">
                  <span>Completed in {moves} moves</span>
                </div>
                <div className="win-actions">
                  <button
                    className="primary-button"
                    onClick={() => document.getElementById("path")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Keep going <b>→</b>
                  </button>
                  <button className="text-button replay-btn" onClick={resetMatch}>
                    wan na play again hmm sanu <span>↻</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="match-progress">
                  Pairs found: {matchedPairs} / {photos.length}
                </p>
                <div className="match-grid">
                  {cards.map((card) => (
                    <button
                      key={card.id}
                      className={`match-card ${card.flipped || card.matched ? "flipped" : ""} ${card.matched ? "matched" : ""}`}
                      onClick={() => handleFlip(card.id)}
                      aria-label={card.flipped || card.matched ? "Flipped card" : "Hidden card"}
                    >
                      <div className="match-card-inner">
                        <div className="match-card-front">
                          <span className="match-card-heart">♥</span>
                        </div>
                        <div className="match-card-back">
                          <div className="match-card-photo-frame">
                            <ProtectedImage src={card.src} alt="Memory photo" fit="cover" className="memory-photo" />
                            <div className="match-card-shimmer" aria-hidden="true" />
                          </div>
                          <div className="match-card-caption">
                            <span className="caption-heart">♥</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {tab === "quiz" && (
          <div className="love-quiz">
            {quizDone ? (
              <div className={`quiz-win ${quizScore === (quizQuestions.length || rawQuestions.length) ? "romantic-celebration" : "quiz-lose-card"}`}>
                {quizScore === (quizQuestions.length || rawQuestions.length) ? (
                  <>
                    <div className="celebration-particles" aria-hidden="true">
                      {Array.from({ length: 10 }, (_, i) => (
                        <span key={i} className="c-heart" style={{ "--ci": i } as CSSProperties}>💖</span>
                      ))}
                    </div>
                    <div className="celebration-badge">✨ 💖 ✨</div>
                    <p className="quiz-win-title">You know every heartbeat of our story!</p>
                    <p className="quiz-win-sub">
                      Perfect score, beb — you hold every single memory so close to your heart. 💗
                    </p>
                    <p className="quiz-score">
                      {quizScore} / {quizQuestions.length || rawQuestions.length} correct
                    </p>
                    <div className="win-actions">
                      <button
                        className="primary-button"
                        onClick={() => document.getElementById("path")?.scrollIntoView({ behavior: "smooth" })}
                      >
                        Next chapter, my love <b>→</b>
                      </button>
                      <button className="text-button replay-btn" onClick={resetQuiz}>
                        wan na play again hmm sanu <span>↻</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="lose-badge">🥺 💗</div>
                    <p className="quiz-win-title lose-title">
                      beb thanabhayeko jasto garirako xeu haiee 🥺💗
                    </p>
                    <p className="quiz-win-sub">
                      I know you know every answer by heart, sanu — look closely and try again!
                    </p>
                    <p className="quiz-score">
                      {quizScore} / {quizQuestions.length || rawQuestions.length} correct
                    </p>
                    <div className="win-actions">
                      <button className="primary-button" onClick={resetQuiz}>
                        Try again, sanu <b>↻</b>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : currentQ ? (
              <div className="quiz-card">
                <p className="quiz-progress">
                  Question {quizIndex + 1} / {quizQuestions.length}
                </p>
                <h3>{currentQ.question}</h3>
                <div className="quiz-options">
                  {currentQ.shuffledOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleQuizAnswer(opt)}
                      disabled={!!quizFeedback}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {quizFeedback && (
                  <p className={`quiz-feedback ${quizFeedback.includes("Almost") || quizFeedback.includes("Not quite") || quizFeedback.includes("Nah") || quizFeedback.includes("Try") ? "wrong" : "right"}`}>
                    {quizFeedback}
                  </p>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
