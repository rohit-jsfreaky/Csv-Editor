
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import aws from 'aws-sdk';
import { s3Client } from "@/utils/s3Client";


export async function DELETE(request) {
    try {

        const fileName = request.nextUrl.searchParams.get("fileName")

        const { userId } = getAuth(request)

        if (!userId) {
            return NextResponse.json({ error: "User UnAuthorized" }, { status: 401 })
        }
        if (!fileName) {
            return NextResponse.json({ error: "File Not Found" }, { status: 404 })
        }

        const fileKey = `${userId}/${fileName}`;

        const headParams = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: fileKey,
        };

        await s3Client.deleteObject(headParams).promise();

        return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });


    } catch (e) {
        return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });

    }
}