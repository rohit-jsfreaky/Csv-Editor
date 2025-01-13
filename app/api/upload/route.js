
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import aws from 'aws-sdk';
import { s3Client } from "@/utils/s3Client";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request) {


    try {
        const { fileName, fileType ,fileSize } = await request.json()

        if(fileSize>MAX_FILE_SIZE){
            return NextResponse.json({ error: "File Size should be less than 5 mb" }, { status: 500 })
        }
        const { userId } = getAuth(request);

        console.log(userId)

        if (!fileName || !fileType) {
            return NextResponse.json({ error: "Please Upload a File" }, { status: 500 })
        }

        if (!userId) {
            return NextResponse.json({ error: "User UnAuthorized" }, { status: 401 })
        }


        if (fileType != "text/csv") {
            return NextResponse.json({ error: "Uploaded File must be a csv File" }, { status: 500 })
        }

        const params = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: `${userId}/${fileName}`, // User-specific path
            ContentType: fileType,
            ACL: 'private',
        }


        const signedUrl = await s3Client.getSignedUrlPromise('putObject', params)


        if (!signedUrl) {
            return NextResponse.json({ error: "Something Went Wrong!" }, { status: 500 })
        }


        return NextResponse.json({ signedUrl: signedUrl }, { status: 200 })

    } catch (e) {
        console.log(e)

        return NextResponse.json({ error: "error" }, { status: 500 })
    }
}