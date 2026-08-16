import type { ExternalResource } from '$types/subject';

interface VideoResource extends ExternalResource {
  duration?: string;
  thumbnail?: string;
  channel?: string;
}

class VideoService {
  private videos: Map<string, VideoResource[]> = new Map();
  
  constructor() {
    this.initializeVideos();
  }
  
  private initializeVideos(): void {
    // FreeCodeCamp videos
    this.videos.set('javascript', [
      {
        title: 'Learn JavaScript - Full Course for Beginners',
        description: 'Complete JavaScript course covering all fundamentals',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
        provider: 'FreeCodeCamp',
        relatedTopic: 'javascript',
        duration: '3:26:43',
        channel: 'freeCodeCamp.org'
      }
    ]);
    
    this.videos.set('python', [
      {
        title: 'Learn Python - Full Course for Beginners',
        description: 'Complete Python course covering all fundamentals',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
        provider: 'FreeCodeCamp',
        relatedTopic: 'python',
        duration: '4:26:52',
        channel: 'freeCodeCamp.org'
      }
    ]);
    
    this.videos.set('typescript', [
      {
        title: 'TypeScript Course for Beginners',
        description: 'Learn TypeScript from scratch',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
        provider: 'FreeCodeCamp',
        relatedTopic: 'typescript',
        duration: '3:16:40',
        channel: 'freeCodeCamp.org'
      }
    ]);
    
    this.videos.set('rust', [
      {
        title: 'Rust Programming Course for Beginners',
        description: 'Learn Rust programming language',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=BpPEoZW5IiY',
        provider: 'FreeCodeCamp',
        relatedTopic: 'rust',
        duration: '13:59:10',
        channel: 'freeCodeCamp.org'
      }
    ]);
    
    this.videos.set('html', [
      {
        title: 'HTML Full Course - Build a Website Tutorial',
        description: 'Complete HTML course',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg',
        provider: 'FreeCodeCamp',
        relatedTopic: 'html',
        duration: '2:02:32',
        channel: 'freeCodeCamp.org'
      }
    ]);
    
    this.videos.set('css', [
      {
        title: 'CSS Full Course - Includes Flexbox and CSS Grid',
        description: 'Complete CSS course',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=ieTHC78giGQ',
        provider: 'FreeCodeCamp',
        relatedTopic: 'css',
        duration: '1:25:11',
        channel: 'freeCodeCamp.org'
      }
    ]);
    
    this.videos.set('algorithms', [
      {
        title: 'Algorithms and Data Structures Tutorial',
        description: 'Full course on algorithms and data structures',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=8hly31xKli0',
        provider: 'FreeCodeCamp',
        relatedTopic: 'algorithms',
        duration: '5:22:09',
        channel: 'freeCodeCamp.org'
      }
    ]);
    
    this.videos.set('databases', [
      {
        title: 'SQL Tutorial - Full Database Course for Beginners',
        description: 'Complete SQL and database course',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
        provider: 'FreeCodeCamp',
        relatedTopic: 'databases',
        duration: '4:20:39',
        channel: 'freeCodeCamp.org'
      }
    ]);
    
    this.videos.set('apis', [
      {
        title: 'APIs for Beginners',
        description: 'Learn how APIs work',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=GZvSYJDk-us',
        provider: 'FreeCodeCamp',
        relatedTopic: 'apis',
        duration: '2:19:33',
        channel: 'freeCodeCamp.org'
      }
    ]);
    
    this.videos.set('git', [
      {
        title: 'Git and GitHub for Beginners',
        description: 'Complete Git and GitHub course',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
        provider: 'FreeCodeCamp',
        relatedTopic: 'git',
        duration: '1:08:30',
        channel: 'freeCodeCamp.org'
      }
    ]);
  }
  
  getVideosForTopic(topicId: string): VideoResource[] {
    return this.videos.get(topicId) || [];
  }
  
  getAllVideos(): VideoResource[] {
    return Array.from(this.videos.values()).flat();
  }
  
  getVideosByProvider(provider: string): VideoResource[] {
    return this.getAllVideos().filter(v => v.provider === provider);
  }
  
  searchVideos(query: string): VideoResource[] {
    const searchTerm = query.toLowerCase();
    return this.getAllVideos().filter(v => 
      v.title.toLowerCase().includes(searchTerm) ||
      v.description?.toLowerCase().includes(searchTerm) ||
      v.relatedTopic?.toLowerCase().includes(searchTerm)
    );
  }
  
  getFreeCodeCampResources(topicId?: string): VideoResource[] {
    if (topicId) {
      return this.getVideosForTopic(topicId).filter(v => v.provider === 'FreeCodeCamp');
    }
    
    return this.getVideosByProvider('FreeCodeCamp');
  }
  
  getRecommendedVideos(topicId: string, count: number = 3): VideoResource[] {
    return this.getVideosForTopic(topicId).slice(0, count);
  }
  
  addVideo(video: VideoResource, topicId: string): void {
    const videos = this.videos.get(topicId) || [];
    videos.push(video);
    this.videos.set(topicId, videos);
  }
  
  removeVideo(videoUrl: string, topicId: string): void {
    const videos = this.videos.get(topicId) || [];
    const filtered = videos.filter(v => v.url !== videoUrl);
    this.videos.set(topicId, filtered);
  }
}

export const videoService = new VideoService();