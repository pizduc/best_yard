
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ProjectShowcase from '@/components/ProjectShowcase';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <ProjectShowcase />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
