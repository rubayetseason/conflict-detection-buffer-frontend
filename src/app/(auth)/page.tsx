import LoginForm from "./_components/LoginForm";
import BaseLoader from "@/components/loaders/BaseLoader";
import { ModeToggleButton } from "@/components/shared/ModeToggleButton";

export default function Home() {
  return (
    <div>
      <BaseLoader></BaseLoader>
      <div className="w-full h-screen font-poppins flex flex-col md:flex-row justify-center items-center">
        {/* left logo */}
        <div className="hidden md:block w-full md:w-1/2 h-full bg-black dark:bg-white"></div>

        {/* right panel */}
        <div className="relative px-5 md:px-0 w-full md:w-1/2 h-full">
          <div className="absolute top-10 right-10">
            <ModeToggleButton />
          </div>
          <div
            key="login"
            className="h-full md:w-[60%] mx-auto flex flex-col justify-center items-center space-y-6"
          >
            <h1 className="text-2xl md:text-5xl font-semibold text-center">
              Conflict Detection Login
            </h1>

            <LoginForm />
            <div className="grid grid-cols-2 gap-3">
              <h1 className="text-sm font-semibold text-center">
                user1@test.com
                <br />
                123456
              </h1>
              <h1 className="text-sm font-semibold text-center">
                user2@test.com
                <br />
                123456
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
