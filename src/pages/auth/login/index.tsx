import { Logo } from "@/components/logo";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import { setCookie } from "cookies-next";
import { COOKIES } from "@/utils/constants";
import { useRouter } from "next/router";
import { Circles, Puff, ThreeDots } from "react-loading-icons";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { query } = useRouter();
  const nextRoute = query.next as string;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password) {
      setError("Enter password");
      return;
    }
    try {
      setError("");
      setIsLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ password }),
        headers: {
          "Content-type": "application/json",
        },
      });

      const response = await res.json();

      setPassword("");
      if (response.error) {
        setError(response.error);
      }
      if (res.status === 200) {
        setCookie(COOKIES.auth, response?.token, COOKIES.options);
        router.replace(nextRoute || "/");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{"Login Hope Jonah"}</title>
        <meta
          name="description"
          content="Hope Jonah: UI/UX Designer Portfolio"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <div className="item-center flex justify-center items-center relative h-screen w-full">
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <Image
            src={`/assets/images/blur.png`}
            width={500}
            height={500}
            alt="blurry background"
            className="object-cover w-full h-full blur-sm"
          />
        </div>
        <div className="card p-10 z-10 text-pri_text max-w-[90%] ">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <p className="h1-text text-center text-white">Password required</p>

          <p className="p-text text-center my-2 font-light lg:w-[70%] mx-auto">
            This link is password protected. Please enter the password to view
            it.
          </p>
          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="uppercase text-p">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="bg-inherit border-border border rounded-md p-4 mt-2"
              />
              <button
                type="submit"
                className="bg-primary mt-5 text-p flex items-center gap-4 justify-center px-4 py-4 text-[#020202] p-text text-center rounded-[10px] font-medium"
              >
                Log in
                {isLoading && (
                  <ThreeDots
                    width={20}
                    height={20}
                    stroke="#1111"
                    strokeOpacity={1.525}
                    fill="#000"
                    fillOpacity={1.5}
                  />
                )}
              </button>
              {error && <p className="p-text text-red-500">{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}