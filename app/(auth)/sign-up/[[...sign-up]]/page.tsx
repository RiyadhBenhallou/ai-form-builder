import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <Image
            alt="Abstract background"
            width={1200}
            height={630}
            src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            {/* <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl lg:hidden">
              Sign In
            </h1>

            <h1 className="hidden text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl lg:block">
              Welcome Back
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500 hidden lg:block">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi
              nam dolorum aliquam, quibusdam aperiam voluptatum.
            </p> */}

            <div className="flex justify-center items-center mt-8 lg:mt-12">
              <SignUp signInForceRedirectUrl={"/dashboard"} />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
