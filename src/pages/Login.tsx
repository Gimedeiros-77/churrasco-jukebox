
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Music } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    const success = login(username, password);

    if (success) {
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } else {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="min-h-screen bg-wood-texture bg-cover bg-center flex items-center justify-center p-4">
      <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-lg w-full max-w-md">
        <div className="text-center mb-6">
          <img 
            src="/lovable-uploads/8ae4a6b3-cd5f-463a-a662-3310937de3a4.png" 
            alt="Churrascaria Original" 
            className="h-24 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white">Login do Jukebox</h1>
          <p className="text-gray-200 mt-2">
            Acesse o sistema de música da Churrascaria Original
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white">Usuário</Label>
            <Input
              id="username"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <Button type="submit" className="w-full mt-6 flex gap-2 items-center">
            <Music size={18} />
            Entrar
          </Button>
          
          <div className="text-center text-sm text-gray-300 mt-4">
            <p>Usuário padrão: admin</p>
            <p>Senha padrão: user</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
