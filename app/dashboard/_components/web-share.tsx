"use client";
import { ReactNode } from "react";
import { RWebShare } from "react-web-share";

export default function WebShare({
  children,
  text,
  title,
  url,
}: {
  children: ReactNode;
  text: string;
  title: string;
  url: string;
}) {
  return (
    <RWebShare
      data={{
        text,
        url,
        title,
      }}
    >
      {children}
    </RWebShare>
  );
}
