import { s3Client } from "@/utils/s3Client";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request) {

    try {   
        const {userId} = getAuth(request)

        if(!userId){
            return NextResponse.json({error:"User Unauthorized"},{status:401})
        }
       
        const params = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            Prefix: `${userId}/`
        }

        const data =  await s3Client.listObjectsV2(params).promise()


        if(!data){
            return NextResponse.json({error:"No Uploads Found"},{status:404})
        }

        const files = data?.Contents?.map((item) => ({
            key: item.Key,
            lastModified: item.LastModified,
            size: item.Size,
          }));



        return NextResponse.json({files:files},{status:200})
        
    } catch (e) {
        return NextResponse.json({error:"Something went Wrong!"},{status:500})
    }

}