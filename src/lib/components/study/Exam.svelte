<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
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
    examDuration?: number; // in minutes
    onComplete?: (score: number, total: number, timeSpent: number) => void;
    onExit?: () => void;
  }
  
  let {
    questions,
    examDuration = 60,
    onComplete = undefined,
    onExit = undefined
  }: Props = $props();
  
  let currentIndex = $state(0);
  let selectedAnswer = $state('');
  let showResult = $state(false);
  let score = $state(0);
  let answers: string[] = $state([]);
  let timeRemaining = $state(examDuration * 60); // in seconds
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let examStarted = $state(false);
  
  function startExam() {
    examStarted = true;
    appStore.playSound('click');
    
    timerInterval = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
      } else {
        // Time's up
        finishExam();
      }
    }, 1000);
  }
  
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
      finishExam();
    }
  }
  
  function finishExam() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    
    const timeSpent = (examDuration * 60) - timeRemaining;
    
    if (onComplete) {
      onComplete(score, questions.length, timeSpent);
    }
  }
  
  function handleExit() {
    appStore.playSound('click');
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    
    if (onExit) {
      onExit();
    }
  }
  
  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  onMount(() => {
    appStore.playSound('click');
  });
  
  onDestroy(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  });
</script>

<div class="exam-container">
  {#if !examStarted}
    <div class="exam-start">
      <h2 class="exam-title">Exam Mode</h2>
      <div class="exam-info">
        <p><strong>Questions:</strong> {questions.length}</p>
        <p><strong>Duration:</strong> {examDuration} minutes</p>
        <p class="exam-note">
          Once you start, the timer will begin. You cannot pause the exam.
        </p>
      </div>
      <button class="start-btn" onclick={startExam}>
        Start Exam
      </button>
      <button class="cancel-btn" onclick={handleExit}>
        Cancel
      </button>
    </div>
  {:else}
    <div class="exam-header">
      <div class="exam-info-header">
        <h3 class="exam-title-header">Exam Mode</h3>
        <span class="exam-progress">
          Question {currentIndex + 1} / {questions.length}
        </span>
      </div>
      
      <div class="timer" class:warning={timeRemaining < 300}>
        ⏱ {formatTime(timeRemaining)}
      </div>
      
      <button 
        class="exit-btn"
        onclick={handleExit}
        aria-label="Exit exam"
      >
        ✕
      </button>
    </div>
    
    <div class="progress-bar">
      <div 
        class="progress-fill"
        style="width: {((currentIndex + 1) / questions.length) * 100}%"
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
      <div class="exam-complete">
        <h3>Exam Complete!</h3>
        <button class="finish-btn" onclick={finishExam}>
          View Results
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .exam-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .exam-start {
    text-align: center;
    padding: 3rem;
    background: #1E293B;
    border: 1px solid #334155;
    border-radius: 1rem;
  }
  
  .exam-title {
    color: #F1F5F9;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .exam-info {
    color: #CBD5E1;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
  
  .exam-info strong {
    color: #F1F5F9;
  }
  
  .exam-note {
    margin-top: 1rem;
    color: #F59E0B;
  }
  
  .start-btn,
  .cancel-btn,
  .finish-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
    margin: 0 0.5rem;
  }
  
  .start-btn {
    background: #10B981;
    color: white;
  }
  
  .start-btn:hover {
    background: #059669;
  }
  
  .cancel-btn {
    background: #334155;
    color: #E2E8F0;
  }
  
  .cancel-btn:hover {
    background: #475569;
  }
  
  .exam-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .exam-info-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .exam-title-header {
    color: #F1F5F9;
    font-size: 1.25rem;
    margin: 0;
  }
  
  .exam-progress {
    color: #94A3B8;
    font-size: 0.9rem;
  }
  
  .timer {
    padding: 0.5rem 1rem;
    background: #0F172A;
    border-radius: 0.5rem;
    color: #F1F5F9;
    font-weight: 600;
    font-family: monospace;
    font-size: 1.1rem;
  }
  
  .timer.warning {
    color: #DC2626;
    animation: pulse 1s infinite;
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
    background: #10B981;
    transition: width 0.3s ease;
  }
  
  .exam-complete {
    text-align: center;
    padding: 3rem;
    background: #1E293B;
    border: 1px solid #334155;
    border-radius: 1rem;
  }
  
  .exam-complete h3 {
    color: #F1F5F9;
    margin-bottom: 1.5rem;
  }
  
  .finish-btn {
    background: #4F46E5;
    color: white;
  }
  
  .finish-btn:hover {
    background: #4338CA;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>