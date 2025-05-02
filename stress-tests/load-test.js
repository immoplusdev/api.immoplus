import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 50,
    duration: '1m'
};

export default function () {
    const res = http.get(`${__ENV.API_URL}/residences/data/public`);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500
    });

    sleep(1);
}
