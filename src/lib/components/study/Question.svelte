<script lang="ts">
  import { appStore } from '$stores/app.svelte';
  
  interface QuestionData {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }
  
  interface Props {
    question: QuestionData;
    questionNumber: number;
    totalQuestions: number;
    selectedAnswer?: string;
    showResult?: boolean;
    onAnswer?: (answer: string) => void;
    onNext?: () => void;
    isLast?: boolean;
  }
  
  let {
    question,
    questionNumber,
    totalQuestions,
    selectedAnswer = '',
    showResult = false,
    onAnswer = undefined,
    onNext = undefined,
    isLast = false
  }: Props = $props();
  
  function handleAnswer(answer: string) {
    if (showResult) return;
    
    appStore.playSound('click');
    if (onAnswer) {
      onAnswer(answer);
    }
  }
  
  function handleNext() {
    appStore.playSound('click');
    if (onNext) {
      onNext();
    }
  }
  
  function getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'easy':
        return '#10B981';
      case 'medium':
        return '#F59E0B';
      case 'hard':
        return '#DC2626';
      default:
        return '#94A3B8';
    }
  }
</script>

<div class="question-container">
  <div class="question-header">
    <div class="question-info">
      <span class="question-number">
        Question {questionNumber} of {totalQuestions}
      </span>
      <span 
        class="difficulty-badge"
        style="background: {getDifficultyColor(question.difficulty)}"
      >
        {question.difficulty}
      </span>
    </div>
  </div>
  
  <div class="question-content">
    <p class="question-text">{question.question}</p>
    
    <div class="options-list">
      {#each question.options as option, index}
        <button 
          class="option-btn"
          class:selected={selectedAnswer === option}
          class:correct={showResult && option === question.correctAnswer}
          class:incorrect={showResult && selectedAnswer === option && option !== question.correctAnswer}
          onclick={() => handleAnswer(option)}
          disabled={showResult}
        >
          <span class="option-letter">{String.fromCharCode(65 + index)}</span>
          <span class="option-text">{option}</span>
          {#if showResult && option === question.correctAnswer}
            <span class="option-icon correct">✓</span>
          {:else if showResult && selectedAnswer === option && option !== question.correctAnswer}
            <span class="option-icon incorrect">✗</span>
          {/if}
        </button>
      {/each}
    </div>
    
    {#if showResult}
      <div class="explanation">
        <strong>Explanation:</strong>
        <p>{question.explanation}</p>
      </div>
      
      <button 
        class="next-btn"
        onclick={handleNext}
      >
        {isLast ? 'Finish' : 'Next Question'}
      </button>
    {/if}
  </div>
</div>

<style>
  .question-container {
    background: #1E293B;
    border: 1px solid #334155;
    border-radius: 1rem;
    padding: 1.5rem;
  }
  
  .question-header {
    margin-bottom: 1.5rem;
  }
  
  .question-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .question-number {
    color: #94A3B8;
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  .difficulty-badge {
    padding: 0.25rem 0.75rem;
    color: white;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .question-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .question-text {
    font-size: 1.2rem;
    color: #F1F5F9;
    line-height: 1.6;
    margin: 0;
  }
  
  .options-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .option-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: #0F172A;
    border: 1px solid #334155;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    color: #CBD5E1;
    position: relative;
  }
  
  .option-btn:hover:not(:disabled) {
    background: #334155;
    border-color: #4F46E5;
  }
  
  .option-btn:focus-visible {
    outline: 2px solid #4F46E5;
    outline-offset: 2px;
  }
  
  .option-btn.selected {
    background: #4F46E5;
    border-color: #4F46E5;
    color: white;
  }
  
  .option-btn.correct {
    background: #10B981;
    border-color: #10B981;
    color: white;
  }
  
  .option-btn.incorrect {
    background: #DC2626;
    border-color: #DC2626;
    color: white;
  }
  
  .option-btn:disabled {
    cursor: default;
  }
  
  .option-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: #334155;
    border-radius: 50%;
    font-weight: 600;
    font-size: 0.9rem;
    flex-shrink: 0;
  }
  
  .option-btn.selected .option-letter,
  .option-btn.correct .option-letter,
  .option-btn.incorrect .option-letter {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  .option-text {
    flex: 1;
  }
  
  .option-icon {
    font-size: 1.25rem;
    font-weight: bold;
  }
  
  .option-icon.correct {
    color: white;
  }
  
  .option-icon.incorrect {
    color: white;
  }
  
  .explanation {
    padding: 1rem;
    background: #0F172A;
    border-radius: 0.5rem;
    border-left: 3px solid #3B82F6;
  }
  
  .explanation strong {
    color: #F1F5F9;
  }
  
  .explanation p {
    margin-top: 0.5rem;
    color: #CBD5E1;
    line-height: 1.6;
  }
  
  .next-btn {
    padding: 0.75rem 1.5rem;
    background: #4F46E5;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
    align-self: flex-end;
  }
  
  .next-btn:hover {
    background: #4338CA;
    transform: translateY(-1px);
  }
</style>