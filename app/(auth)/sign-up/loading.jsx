import { Atom } from "react-loading-indicators";

export default function Loading() {
  return (
    <div className='h-screen w-screen flex justify-center items-center'>
             <Atom color="#0a1312" size="large" text="" textColor="#0c0c0c" />
    </div>
  );
}