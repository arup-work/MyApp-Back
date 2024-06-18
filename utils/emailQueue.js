import Queue from 'bull';

const emailQueue = new Queue('email', {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
});

export default emailQueue;