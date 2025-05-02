import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    vus: 10,
    iterations: 10,
    duration: '10m'
};

const videoFile = open('../uploads/sample-video.mp4');

// The default exported function is gonna be picked up by k6 as the entry point for the test script. It will be executed repeatedly in "iterations" for the whole duration of the test.
export default function () {
    // Make a GET request to the target URL

// Replace with the actual path to your video file

    const url = 'http://api-v2.immoplus.ci/files/public'; // Replace with the target URL

    const payload = {
        file: http.file(videoFile, 'video.mp4', 'video/mp4'), // Specify the file, filename, and MIME type
    };

    const headers = {
        'Content-Type': 'multipart/form-data',
    };

    http.post(url, payload, { headers });

    // Sleep for 1 second to simulate real-world usage
    sleep(1);
}
