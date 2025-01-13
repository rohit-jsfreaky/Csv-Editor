import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (

    <div className="flex justify-center items-center w-full" style={{ height: `calc(100vh - 64px)` }}>
      <SignIn/>
    </div>
  )
}