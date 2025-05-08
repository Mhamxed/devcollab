import CTASection from "./CTA";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";

export default function HomePage({ user }) {
    return (
        <>
            <Hero user={ user } />
            <Features />
            <CTASection user={user}/>
            <Footer />
        </>
    )
}