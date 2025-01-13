import { s3Client } from "@/utils/s3Client";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  

    try {
        const fileName = request.nextUrl.searchParams.get("fileName")


        const { userId } = getAuth(request)

        if (!userId) {
            return NextResponse.json({ message: "User UnAuthorized" }, { status: 401 })
        }
        if (!fileName) {
            return NextResponse.json({ message: "File Not Found" }, { status: 404 })
        }


        const fileKey = `${userId}/${fileName}`;

        const headParams = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: fileKey,
        };

        console.log(headParams)

        await s3Client.headObject(headParams).promise()

        const signedUrl = await s3Client.getSignedUrlPromise('getObject', {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Key: fileKey,
            Expires: 60 * 5, // URL valid for 5 minutes
            ResponseContentDisposition: `attachment; filename="${fileName}"`
        });


        console.log(signedUrl)
        if(!signedUrl){
            return NextResponse.json({message:"File Not Found"},{status:404})
        }

        return NextResponse.json({signedUrl:signedUrl},{status:200})

    } catch (e) {
        if(e.code === "NotFound"){
            return NextResponse.json({message:"File Not Found"},{status:404})
        }

        return NextResponse.json({message:"Something went wrong"},{status:500})
    }
}