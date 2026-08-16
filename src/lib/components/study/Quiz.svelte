<script lang="ts">
  import { onMount } from 'svelte';
  import { appStore } from '$stores/app.svelte';
  import Question from './Question.svelte';
  
  interface QuestionData {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }
  
  interface Props {
    questions: QuestionData[];
    onComplete?: (score: number, total: number) => void;
    onExit?: () => void;
  }
  
  let {
    questions,
    onComplete = undefined,
    onExit = undefined
  }: Props = $props();
  
  let currentIndex = $state(0);
  let selectedAnswer = $state('');
  let showResult = $state(false);
  let score = $state(0);
  let answers: string[] = $state([]);
  
  function handleAnswer(answer: string) {
    selectedAnswer = answer;
    showResult = true;
    
    const isCorrect = answer === questions[currentIndex]?.correctAnswer;
    if (isCorrect) {
      score++;
      appStore.playSound('success');
    }
    
    answers[currentIndex] = answer;
  }
  
  function handleNext() {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      selectedAnswer = '';
      showResult = false;
    } else {
      // Quiz complete
      if (onComplete) {
        onComplete(score, questions.length);
      }
    }
  }
  
  function handleExit() {
    appStore.playSound('click');
    if (onExit) {
      onExit();
    }
  }
  
  function restartQuiz() {
    currentIndex = 0;
    selectedAnswer = '';
    showResult = false;
    score = 0;
    answers = [];
    appStore.playSound('click');
  }
  
  onMount(() => {
    appStore.playSound('click');
  });
</script>

<div class="quiz-container">
  <div class="quiz-header">
    <div class="quiz-info">
      <h3 class="quiz-title">Quiz</h3>
      <span class="quiz-progress">
        Score: {score} / {questions.length}
      </span>
    </div>
    <button 
      class="exit-btn"
      onclick={handleExit}
      aria-label="Exit quiz"
    >
      ✕
    </button>
  </div>
  
  <div class="progress-bar">
    <div 
      class="progress-fill"
      style="width: {((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100}%"
    ></div>
  </div>
  
  {#if currentIndex < questions.length}
    <Question
      question={questions[currentIndex]}
      questionNumber={currentIndex + 1}
      totalQuestions={questions.length}
      {selectedAnswer}
      {showResult}
      onAnswer={handleAnswer}
      onNext={handleNext}
      isLast={currentIndex === questions.length - 1}
    />
  {:else}
    <div class="quiz-complete">
      <h3>Quiz Complete!</h3>
      <p>Your score: {score} / {questions.length}</p>
      <p class="percentage">
        {Math.round((score / questions.length) * 100)}%
      </p>
      <div class="complete-actions">
        <button class="btn-restart" onclick={restartQuiz}>
          Restart Quiz
        </button>
        <button class="btn-exit" onclick={handleExit}>
          Exit
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .quiz-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .quiz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .quiz-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .quiz-title {
    color: #F1F5F9;
    font-size: 1.25rem;
    margin: 0;
  }
  
  .quiz-progress {
    color: #94A3B8;
    font-size: 0.9rem;
  }
  
  .exit-btn {
    width: 2.5rem;
    height: 2.5rem;
    background: #334155;
    border: none;
    border-radius: 0.5rem;
    color: #CBD5E1;
    cursor: pointer;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .exit-btn:hover {
    background: #DC2626;
    color: white;
  }
  
  .progress-bar {
    width: 100%;
    height: 0.5rem;
    background: #0F172A;
    border-radius: 9999px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: #4F46E5;
    transition: width 0.3s ease;
  }
  
  .quiz-complete {
    text-align: center;
    padding: 3rem;
    background: #1E293B;
    border: 1px solid #334155;
    border-radius: 1rem;
  }
  
  .quiz-complete h3 {
    color: #F1F5F9;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  .quiz-complete p {
    color: #CBD5E1;
    margin-bottom: 0.5rem;
  }
  
  .percentage {
    font-size: 2rem;
    font-weight: bold;
    color: #4F46E5;
    margin: 1rem 0;
  }
  
  .complete-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }
  
  .btn-restart,
  .btn-exit {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }
  
  .btn-restart {
    background: #4F46E5;
    color: white;
  }
  
  .btn-restart:hover {
    background: #4338CA;
  }
  
  .btn-exit {
    background: #334155;
    color: #E2E8F0;
  }
  
  .btn-exit:hover {
    background: #475569;
  }
</style>