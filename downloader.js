const clipboardy = require('clipboardy');           // Import the clipboardy module for clipboard interaction (reading from and writing to the clipboard)
const { spawn } = require('child_process');         // Import the spawn function to create and manage child processes
const path = require('path');                       // Import path module to work with file and directory paths
const chalk = require('chalk');                     // Import chalk module to style terminal output with colors
const yargs = require('yargs/yargs');               // Import yargs for parsing command-line arguments
const { hideBin } = require('yargs/helpers');       // Helper method from yargs to simplify command-line arguments processing

// Get the directory where the script is located
const SCRIPT_DIR = path.dirname(process.argv[1]);

// Supported platforms for download
const SUPPORTED_PLATFORMS = [
    'youtube.com',
    'youtu.be',
    'tiktok.com',
    'instagram.com',
    'facebook.com',
    'vimeo.com',
    'dailymotion.com',
    'soundcloud.com',
    'twitter.com',
    'reddit.com',
    'twitch.tv',
    'streamable.com',
];

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
    .option('output', {
        alias: 'o',
        description: 'Output directory path',
        type: 'string',
        default: path.join(SCRIPT_DIR, 'downloads') // Set default relative to script location
    })
    .option('audio', {
        description: 'Download audio only',
        type: 'boolean',
        conflicts: 'video'
    })
    .option('video', {
        description: 'Download video',
        type: 'boolean',
        conflicts: 'audio'
    })
    .help()
    .argv;

// Function to open downloads folder
function openFolder(folderPath) {
    const absolutePath = path.resolve(folderPath);
    const process = spawn('explorer', [absolutePath]);
    process.on('error', (error) => {
            console.error(chalk.red('Failed to open downloads folder:'), chalk.yellow(error.message));
    });
}

// Function to validate if URL is from a supported platform
function isValidUrl(url) {
    try {
        new URL(url);
        return SUPPORTED_PLATFORMS.some(platform => url.includes(platform));
    } catch {
        return false;
    }
}

// Get path to yt-dlp executable
const ytDlpPath = path.join(SCRIPT_DIR, 'bin', 'yt-dlp.exe');

// Add retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

// Build download options based on provided arguments
function buildDownloadOptions(url, outputPath) {
    const options = [
        url,
        '-P', outputPath,
        '--no-playlist',
        '--progress',
        '--newline',
        '--progress-template', '%(progress._percent_str)s %(progress._speed_str)s %(progress._eta_str)s'
    ];

    if (argv.audio) {
        options.push('-x', '--audio-format', 'mp3');
    }

    if (argv.video) {
        options.push('-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best');
    }

    return options;
}

// Add state tracking constants
const STATES = {
    DOWNLOADING: 'Downloading',
    EXTRACTING: 'Extracting audio',
    MERGING: 'Merging formats',
    CONVERTING: 'Converting'
};

// Add retry mechanism
async function attemptDownload(url, options, attempt = 1) {
    try {
        const ytDlp = spawn(ytDlpPath, options);
        
        let currentState = STATES.DOWNLOADING;
        
        ytDlp.stdout.on('data', (data) => {
            const output = data.toString();
            
            // Update current state based on yt-dlp output
            if (output.includes('[ExtractAudio]')) {
                currentState = STATES.EXTRACTING;
            } else if (output.includes('[download]')) {
                currentState = STATES.DOWNLOADING;
            } else if (output.includes('[Merger]')) {
                currentState = STATES.MERGING;
            } else if (output.includes('[converting]')) {
                currentState = STATES.CONVERTING;
            }

            // Display progress with current state
            if (output.includes('%')) {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(chalk.cyan(`${currentState}: ${output.trim()}`));
            } else {
                console.log(output);
            }
        });

        return new Promise((resolve, reject) => {
            ytDlp.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`Download failed with code ${code}`));
            });
            ytDlp.on('error', reject);
        });
    } catch (error) {
        if (attempt < MAX_RETRIES) {
            console.log(chalk.yellow(`Retry attempt ${attempt} of ${MAX_RETRIES}...`));
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return attemptDownload(url, options, attempt + 1);
        }
        throw error;
    }
}

// Main download function
async function downloadMedia() {
    try {
        // Get URL from clipboard using synchronous read
        const url = await clipboardy.read();

        // Validate URL
        if (!isValidUrl(url)) {
            console.error(chalk.red(`Error: Invalid URL or unsupported platform.\nSupported platforms: ${SUPPORTED_PLATFORMS.join(', ')}`));
            return;
        }

        if (!argv.audio && !argv.video) {
            console.error(chalk.red('Error: Please specify either --audio or --video option'));
            return;
        }

        console.log(chalk.cyan(`Script directory: ${SCRIPT_DIR}`));
        console.log(chalk.cyan(`Starting download from: ${url}`));
        console.log(chalk.cyan(`Output directory: ${argv.output}`));

        const options = buildDownloadOptions(url, argv.output);
        
        await attemptDownload(url, options);
        console.log(chalk.green('\nDownload completed successfully!'));
        openFolder(argv.output);

    } catch (error) {
        console.error(chalk.red('An error occurred:'), chalk.yellow(error.message));
    }
}

// Start the download process
downloadMedia();
