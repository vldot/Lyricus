/**
 * Parse LRC format lyrics into structured data
 * LRC format: [mm:ss.xx]Lyric text
 * Example: [00:12.00]First line of lyrics
 *
 * @param {string} lrcString - Raw LRC format string
 * @returns {Array<Object>} Array of {time: number, text: string}
 */
function parseLRC(lrcString) {
    if (!lrcString) return [];

    const lines = lrcString.split('\n');
    const parsed = [];

    // Regex to match [mm:ss.xx] or [mm:ss]
    const timeRegex = /\[(\d{2,}):(\d{2})\.(\d{2,3})\]/g;
    const simpleTimeRegex = /\[(\d{2,}):(\d{2})\]/g;

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        // Try to match timestamp
        let match = timeRegex.exec(line);

        // If no match with milliseconds, try without
        if (!match) {
            match = simpleTimeRegex.exec(line);
        }
 
        if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const centiseconds = match[3] ? parseInt(match[3], 10) : 0;
 
            // Convert to total seconds
            const timeInSeconds = minutes * 60 + seconds + centiseconds / 100;
 
            // Extract text after timestamp
            const text = line.substring(match[0].length).trim();

            // Skip metadata lines (like [ar:Artist], [ti:Title])
            if (text && !text.startsWith('[')) {
                parsed.push({
                    time: timeInSeconds,
                    text: text
                });
            }
        }
    }

    // Sort by time (should already be sorted, but just in case)
    parsed.sort((a, b) => a.time - b.time);

    return parsed;
}

/**
 * Find the current lyric line based on playback time
 * @param {Array<Object>} lines - Parsed lyric lines
 * @param {number} currentTime - Current playback time in seconds
 * @returns {number} Index of current line
 */
function getCurrentLineIndex(lines, currentTime) {
    if (!lines || lines.length === 0) return -1;

    // Find the last line whose time is <= currentTime
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].time <= currentTime) {
            return i;
        }
    }

    return -1;
}

module.exports = {
    parseLRC,
    getCurrentLineIndex
};
 