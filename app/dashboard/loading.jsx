import { Atom } from "react-loading-indicators";

export default function Loading() {
  return (
    <div className="flex justify-center items-center w-full" style={{ height: `calc(100vh - 64px)` }}>
      <Atom color="#0a1312" size="large" text="" textColor="#0c0c0c" />
    </div>
  );
}

