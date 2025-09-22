"use client";
import dynamic from "next/dynamic";
import { LoadingSpinner } from "./loading-spinner";
import { Font } from "@react-pdf/renderer";

Font.register({
  family: "Alexandria",
  src: "/fonts/Alexandria/static/Alexandria-Regular.ttf",
  fontWeight: "normal",
});

Font.register({
  family: "Alexandria",
  src: "/fonts/Alexandria/static/Alexandria-Bold.ttf",
  fontWeight: "bold",
});

export const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <LoadingSpinner
        wrapperClass="h-screen w-full flex items-center justify-center"
        spinnerClass="h-8 w-8"
      />
    ),
  }
);

export const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <LoadingSpinner
        wrapperClass="h-screen w-full flex items-center justify-center"
        spinnerClass="h-8 w-8"
      />
    ),
  }
);
