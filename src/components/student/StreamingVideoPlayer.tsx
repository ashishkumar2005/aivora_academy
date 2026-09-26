import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Video,
  MonitorPlay,
} from 'lucide-react';
import { Lecture } from '../../types';
import { useAuth } from '../../lib/authContext';

interface StreamingVideoPlayerProps {
  lecture: Lecture;
  onLectureComplete?: () => void;
}

export const StreamingVideoPlayer: React.FC<StreamingVideoPlayerProps> = ({
  lecture,
  onLectureComplete,
}) => {
  const { studentProgress, saveProgress, currentStudent } = useAuth();
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Determine video source
  const videoSourceUrl = lecture.videoUrl || lecture.videoStreamId || '';
  const isYouTube = videoSourceUrl.includes('youtube.com') || videoSourceUrl.includes('youtu.be');
  const isDirectVideo =
    !isYouTube &&
    (videoSourceUrl.startsWith('http://') ||
      videoSourceUrl.startsWith('https://') ||
      videoSourceUrl.startsWith('blob:') ||
      videoSourceUrl.startsWith('data:video/'));

  // Existing progress for this lecture
  const currentProgress = studentProgress.find((p) => p.lectureId === lecture.id);
  const initialResumeTime = currentProgress?.lastWatchedSeconds || 0;

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(
    initialResumeTime > 10 && !currentProgress?.isCompleted ? initialResumeTime : 0
  );
  const [duration, setDuration] = useState<number>(lecture.durationSeconds || 1320);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showResumeBanner, setShowResumeBanner] = useState<boolean>(
    initialResumeTime > 15 && initialResumeTime < (lecture.durationSeconds || 1320) - 30
  );
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'video' | 'visualizer'>(isDirectVideo || isYouTube ? 'video' : 'visualizer');
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if lecture changes
  useEffect(() => {
    setDuration(lecture.durationSeconds || 1320);
    const existing = studentProgress.find((p) => p.lectureId === lecture.id);
    if (existing && existing.lastWatchedSeconds > 15 && !existing.isCompleted) {
      setShowResumeBanner(true);
      setCurrentTime(existing.lastWatchedSeconds);
    } else {
      setShowResumeBanner(false);
      setCurrentTime(0);
    }
    setIsPlaying(false);
    setViewMode(isDirectVideo || isYouTube ? 'video' : 'visualizer');

    if (videoRef.current) {
      videoRef.current.currentTime = existing?.lastWatchedSeconds || 0;
    }
  }, [lecture.id, isDirectVideo, isYouTube]);

  // Video element events
  const handleVideoLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      const realDur = Math.round(videoRef.current.duration);
      if (realDur > 0 && !isNaN(realDur)) {
        setDuration(realDur);
      }
      if (initialResumeTime > 10) {
        videoRef.current.currentTime = initialResumeTime;
      }
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);
      if (Math.floor(cur) % 4 === 0) {
        saveProgress(lecture.id, cur, duration);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    saveProgress(lecture.id, duration, duration, true);
    if (onLectureComplete) onLectureComplete();
  };

  // Canvas visualizer ticker when in visualizer mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && (viewMode === 'visualizer' || !isDirectVideo)) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1 * playbackSpeed;
          if (next >= duration) {
            setIsPlaying(false);
            saveProgress(lecture.id, duration, duration, true);
            if (onLectureComplete) onLectureComplete();
            return duration;
          }
          if (Math.floor(next) % 5 === 0) {
            saveProgress(lecture.id, next, duration);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, viewMode, isDirectVideo, playbackSpeed, duration, lecture.id, saveProgress, onLectureComplete]);

  // Animated visualizer rendering
  useEffect(() => {
    if (viewMode !== 'visualizer' && isDirectVideo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const render = () => {
      frame++;
      const width = canvas.width;
      const height = canvas.height;

      // Dark slate educational chalkboard background with subtle gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#090d16');
      gradient.addColorStop(0.5, '#1e1b4b');
      gradient.addColorStop(1, '#090d16');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Subtle grid lines (AI graph matrix)
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Animated sine wave / AI neural activation waves when playing
      if (isPlaying) {
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.65)';
        for (let x = 0; x < width; x += 3) {
          const y = height / 2 + Math.sin((x + frame * 3 * playbackSpeed) * 0.015) * 30 + Math.cos((x - frame) * 0.02) * 15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.cos((x + frame * 2 * playbackSpeed) * 0.02) * 22;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Center Lecture Slide Banner overlay
      const cardW = Math.min(width * 0.85, 540);
      const cardH = 210;
      const cardX = (width - cardW) / 2;
      const cardY = (height - cardH) / 2 - 10;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 14);
      ctx.fill();
      ctx.stroke();

      // Card Title text
      ctx.fillStyle = '#818cf8';
      ctx.font = '600 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CLASS 10 ARTIFICIAL INTELLIGENCE · STREAMING LECTURE', width / 2, cardY + 36);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 19px system-ui, sans-serif';
      const displayTitle = lecture.title.length > 36 ? lecture.title.substring(0, 36) + '...' : lecture.title;
      ctx.fillText(displayTitle, width / 2, cardY + 75);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '400 13px system-ui, sans-serif';
      const subText = isPlaying
        ? `▶ Streaming Active (${playbackSpeed}x Speed)`
        : 'Paused · Tap play button or screen to start';
      ctx.fillText(subText, width / 2, cardY + 115);

      // Watermark for student security (domain protected stream)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.font = '500 11px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`Protected Stream · Student Roll: ${currentStudent?.rollNumber || '24'}`, width - 20, height - 20);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, lecture.title, viewMode, isDirectVideo, currentStudent?.rollNumber]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isDirectVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch((err) => {
          console.warn('Playback error:', err);
          setIsPlaying(true);
        });
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (isDirectVideo && videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    saveProgress(lecture.id, newTime, duration);
  };

  const handleSkip = (offset: number) => {
    const next = Math.max(0, Math.min(duration, currentTime + offset));
    setCurrentTime(next);
    if (isDirectVideo && videoRef.current) {
      videoRef.current.currentTime = next;
    }
    saveProgress(lecture.id, next, duration);
  };

  const handleToggleMute = () => {
    if (isDirectVideo && videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
    if (isDirectVideo && videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isDirectVideo && videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleResumeClick = () => {
    setCurrentTime(initialResumeTime);
    if (isDirectVideo && videoRef.current) {
      videoRef.current.currentTime = initialResumeTime;
      videoRef.current.play().catch(console.warn);
    }
    setShowResumeBanner(false);
    setIsPlaying(true);
  };

  const handleStartOverClick = () => {
    setCurrentTime(0);
    if (isDirectVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.warn);
    }
    setShowResumeBanner(false);
    setIsPlaying(true);
  };

  const handleMouseMove = () => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 3500);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0` : url;
  };

  return (
    <div
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 select-none group aspect-video max-h-[580px] flex items-center justify-center ${
        isFullscreen ? 'h-screen max-h-none rounded-none' : ''
      }`}
    >
      {/* 1. YouTube Player Mode */}
      {isYouTube && viewMode === 'video' ? (
        <iframe
          src={getYouTubeEmbedUrl(videoSourceUrl)}
          title={lecture.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      ) : isDirectVideo && viewMode === 'video' ? (
        /* 2. Direct HTML5 Video Player (Uploaded File, MP4, Stream URL) */
        <video
          ref={videoRef}
          src={videoSourceUrl}
          playsInline
          onLoadedMetadata={handleVideoLoadedMetadata}
          onTimeUpdate={handleVideoTimeUpdate}
          onEnded={handleVideoEnded}
          onClick={handlePlayPause}
          className="w-full h-full object-contain cursor-pointer"
        />
      ) : (
        /* 3. Canvas Blackboard Educational Visualizer */
        <canvas
          ref={canvasRef}
          width={854}
          height={480}
          onClick={handlePlayPause}
          className="w-full h-full object-cover cursor-pointer"
        />
      )}

      {/* Dynamic Watermark for Enterprise Stream Security */}
      <div className="absolute top-4 right-4 pointer-events-none z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 text-[10px] font-mono text-slate-300">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        <span>Stream ID: {lecture.videoStreamId.substring(0, 14)}</span>
      </div>

      {/* Mode switcher (Video vs Visualizer) if video is direct */}
      {isDirectVideo && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-slate-900/70 backdrop-blur-md p-1 rounded-lg border border-slate-700/60 text-xs">
          <button
            onClick={() => setViewMode('video')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === 'video' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Video className="w-3 h-3" />
            <span>Video</span>
          </button>
          <button
            onClick={() => setViewMode('visualizer')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === 'visualizer' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            <MonitorPlay className="w-3 h-3" />
            <span>Classroom Board</span>
          </button>
        </div>
      )}

      {/* Resume Banner Popup */}
      {showResumeBanner && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 backdrop-blur-md border border-indigo-500/40 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">
              Resume from {formatTime(initialResumeTime)}?
            </p>
            <p className="text-[10px] text-slate-400">Continue from where you stopped</p>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <button
              onClick={handleResumeClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              Resume
            </button>
            <button
              onClick={handleStartOverClick}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-md transition-colors cursor-pointer"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* Big Center Play/Pause Overlay Icon when paused */}
      {!isPlaying && !isYouTube && (
        <button
          onClick={handlePlayPause}
          aria-label="Play video"
          className="absolute z-20 w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
        >
          <Play className="w-8 h-8 fill-current translate-x-0.5" />
        </button>
      )}

      {/* Custom Bottom Controls Bar (Visible on direct video or canvas visualizer) */}
      {!isYouTube && (
        <div
          className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent pt-8 pb-3 px-4 transition-opacity duration-300 ${
            isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Timeline Scrubber */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[11px] font-mono text-slate-300 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                aria-label="Seek video timeline"
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-2 transition-all"
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400 w-10">
              {formatTime(duration)}
            </span>
          </div>

          {/* Buttons Row */}
          <div className="flex items-center justify-between text-white text-xs">
            {/* Left Controls: Play, Skip +/-10, Volume */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handlePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="p-1.5 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={() => handleSkip(-10)}
                title="Rewind 10 seconds"
                aria-label="Rewind 10 seconds"
                className="p-1.5 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleSkip(10)}
                title="Forward 10 seconds"
                aria-label="Forward 10 seconds"
                className="p-1.5 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5 ml-2 group/vol">
                <button
                  onClick={handleToggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="p-1 hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume slider"
                  className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hidden sm:block"
                />
              </div>
            </div>

            {/* Right Controls: Playback Speed, Fullscreen */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Speed Selector */}
              <div className="flex items-center bg-slate-800/80 rounded-lg px-2 py-0.5 border border-slate-700/60">
                {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                      playbackSpeed === s ? 'text-indigo-400 font-bold bg-indigo-950/60' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={handleToggleFullscreen}
                aria-label="Toggle fullscreen"
                className="p-1.5 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
