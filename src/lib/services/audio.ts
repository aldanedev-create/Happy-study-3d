// Compatibility facade for code that imports the audio service. The persistent
// IndexedDB-backed store is the single source of truth for recordings.
import { audioStore, type AudioRecording } from '$stores/audio.svelte';

export type Recording = AudioRecording;

export const audioService = {
  startRecording: () => audioStore.startRecording(),
  pauseRecording: () => audioStore.pauseRecording(),
  stopRecording: () => audioStore.stopRecording(),
  cancelRecording: () => audioStore.cancelRecording(),
  deleteRecording: (id: string) => audioStore.deleteRecording(id),
  renameRecording: (id: string, name: string) => audioStore.renameRecording(id, name),
  clearAllRecordings: () => audioStore.clearAllRecordings(),
  getRecordings: (): AudioRecording[] => audioStore.recordings,
  getRecording: (id: string): AudioRecording | null => audioStore.recordings.find((recording) => recording.id === id) ?? null,
  getRecordingState: () => ({
    isRecording: audioStore.isRecording,
    isPaused: audioStore.isPaused,
    time: audioStore.recordingTime
  })
};
