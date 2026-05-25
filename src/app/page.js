import CanvasSequence from './components/CanvasSequence';
import ShopSection from './components/ShopSection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';

/**
 * Root page — Server Component.
 * The heavy interactive work is inside CanvasSequence (Client Component).
 */
export default function Page() {
  return (
    <>
      <CanvasSequence />
      <ShopSection />
      <AboutSection />
      <Footer />
    </>
  );
}
