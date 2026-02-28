# SachCheck — Product Requirements Document

## Problem Statement
A mobile app that takes a URL for an Instagram Reel or YouTube Short, extracts the audio, transcribes it, performs a fact-check on the transcript's claims, and generates a Text-to-Speech (TTS) audio of the verdict in a selected regional Indian language.

## Core Requirements
1. **Input**: URL from Instagram or YouTube
2. **Audio Extraction**: Download audio from the provided URL via RapidAPI
3. **Transcription**: Convert audio to text using Groq Whisper
4. **Fact-Checking**: Analyze claims using Groq Llama 3.3 70B — returns verdict, confidence, detailed context
5. **TTS Generation**: Synthesize verdict in 6+ Indian languages using Sarvam AI bulbul:v2
6. **UI**: Mobile-first Expo app with dark theme

## Tech Stack
- **Frontend**: Expo (React Native), TypeScript, Zustand, Expo Router, Expo AV
- **Backend**: Python, FastAPI, Pydantic
- **Database**: MongoDB (configured, not yet used for caching)
- **APIs**: Groq (Whisper + Llama 3.3), Sarvam AI (TTS), RapidAPI (YouTube mp36 + Instagram Reels Downloader)

## What's Implemented ✅
- Full fact-checking pipeline: URL → Audio → Transcript → Fact-Check → TTS
- Enhanced context in results: category, key_points, fact_details, what_to_know, sources_note
- In-memory caching (per-session)
- Support for YouTube Shorts and Instagram Reels
- 8 Indian languages supported (Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati)
- Dark-themed mobile UI with VerdictCard, LanguagePicker, LoadingOverlay
- Health check endpoint for deployment

## Backlog
- **P0**: MongoDB persistent caching
- **P1**: Self-hosted video extraction (Cobalt/yt-dlp)
- **P1**: Robust RapidAPI error handling with retries/fallbacks
- **P2**: History screen for past fact-checks
- **P2**: Android share extension
- **P3**: Code cleanup (remove dead API fallback code)

## Architecture
```
/app
├── backend/
│   ├── server.py          # FastAPI — single /api/check endpoint + /api/health
│   ├── .env               # GROQ_API_KEY, SARVAM_API_KEY, RAPIDAPI_KEY, MONGO_URL
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── index.tsx      # Home screen (URL input + language picker)
│   │   ├── result.tsx     # Result screen (VerdictCard + audio player)
│   │   └── _layout.tsx
│   ├── components/
│   │   ├── VerdictCard.tsx
│   │   ├── LanguagePicker.tsx
│   │   └── LoadingOverlay.tsx
│   ├── store/useCheckStore.ts
│   └── constants/languages.ts
```

## Changelog
- **Feb 2026**: Fixed backend bug — enhanced context fields now correctly passed in CheckResponse. All 11 fields verified via automated backend tests.
