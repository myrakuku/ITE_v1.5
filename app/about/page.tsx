"use client";

import ContactUs from "@/Web_components/ContactUs";
import Footer from "@/Web_components/Footer";
import ITESection from "@/Web_components/ITESection";
import Nav from "@/Web_components/Nav";
import OurTeam from "@/Web_components/OurTeam";

export default function About() {
  return (
    <>
        <Nav />
        <ITESection/>
        <OurTeam/>
        <ContactUs />
        <Footer/>
    </>
  );
}