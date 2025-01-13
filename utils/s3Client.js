
import aws from 'aws-sdk';

export const s3Client = new aws.S3({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY
    },

})