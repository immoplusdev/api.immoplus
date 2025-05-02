import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    vus: 100,
    iterations: 100,
};

const videoFile = open('../uploads/sample-image.jpg');

// The default exported function is gonna be picked up by k6 as the entry point for the test script. It will be executed repeatedly in "iterations" for the whole duration of the test.
export default function () {
    // Make a GET request to the target URL

// Replace with the actual path to your video file

    const url = 'http://api-v2.immoplus.ci/files/public'; // Replace with the target URL

    const payload = {
        file: http.file(videoFile, 'sample-image.jpg', 'image/jpeg'), // Specify the file, filename, and MIME type
    };

    const headers = {
        'Content-Type': 'multipart/form-data',
    };

    http.post(url, payload, { headers });

    // Sleep for 1 second to simulate real-world usage
    sleep(1);
}
