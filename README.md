# YT-DLP StreamDeck Integration

A simple yet media downloader for Stream Deck, powered by yt-dlp.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents
- [YT-DLP StreamDeck Integration](#yt-dlp-streamdeck-integration)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Prerequisites](#prerequisites)
    - [Getting yt-dlp](#getting-yt-dlp)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [Acknowledgments](#acknowledgments)

## Description
This project integrates yt-dlp with Stream Deck, allowing you to download media from various platforms with a single button press. It supports audio and video downloads from multiple platforms including YouTube, TikTok, Instagram, and more.

## Prerequisites
- Node.js (v14 or higher)
- Stream Deck Software
- Windows OS
- yt-dlp executable

### Getting yt-dlp
1. Download the latest yt-dlp executable:
   - Visit [yt-dlp releases page](https://github.com/yt-dlp/yt-dlp/releases)
   - Download `yt-dlp.exe` from the latest release

2. Place the executable:
   - Open the `bin` folder in the project directory
   - Move `yt-dlp.exe` to the `bin` folder

Note: Keep yt-dlp updated regularly for best performance and compatibility.

## Installation
1. Clone the repository
```bash
git clone https://github.com/hypegg/ytdlp-streamdeck.git
```

2. Install dependencies
```bash
npm install
```

3. Place yt-dlp.exe in the `bin` folder

## Usage
Configure your Stream Deck button to execute the script with desired parameters:

For audio downloads:
```bash
node "c:\location\to\the\yt-dlp-streamdeck\downloader.js" --audio
```

For video downloads:
```bash
node "c:\location\to\the\yt-dlp-streamdeck\downloader.js" --video
```

Now just copy the link to the system clipboard and press the key in the Stream Deck

Supported platforms:
- YouTube
- TikTok
- Instagram
- Facebook
- Vimeo
- DailyMotion
- SoundCloud
- Twitter
- Reddit
- Twitch
- Streamable

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) for the amazing downloading capabilities
- [Stream Deck](https://www.elgato.com/stream-deck) for the integration platform
- All the wonderful package maintainers of our dependencies
