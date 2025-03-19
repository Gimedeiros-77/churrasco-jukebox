
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-wood-texture bg-cover">
      <div className="glass-panel p-8 rounded-lg text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">404</h1>
        <p className="text-xl text-white mb-4">Oops! Página não encontrada</p>
        <a href="/" className="text-white hover:text-primary-foreground underline">
          Voltar para o Início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
