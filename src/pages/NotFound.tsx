
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { HomeIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30">
      <div className="text-center p-8 max-w-md backdrop-blur-card rounded-xl animate-fade-up">
        <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
          404
        </span>
        <h1 className="text-4xl font-serif font-bold mb-4">Страница не найдена</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Извините, запрашиваемая страница не существует или была перемещена.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          <HomeIcon size={18} className="mr-2" />
          Вернуться на главную
        </a>
      </div>
    </div>
  );
};

export default NotFound;
