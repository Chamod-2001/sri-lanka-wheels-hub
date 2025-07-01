
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bike, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: (credentials: { email: string; password: string }) => boolean;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    const success = onLogin({ email, password });
    
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome to Lankan Wheels Management System",
      });
    } else {
      setError("Invalid email or password");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md border-yellow-300 shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-yellow-400 to-amber-400 rounded-t-lg">
          <div className="flex justify-center mb-4">
            <div className="bg-black p-3 rounded-full">
              <Bike className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <CardTitle className="text-black text-2xl">Lankan Wheels</CardTitle>
          <CardDescription className="text-gray-800">
            Vehicle Management System Login
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-yellow-300 focus:border-yellow-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-yellow-300 focus:border-yellow-500"
                required
              />
            </div>

            {error && (
              <Alert className="border-red-300 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 text-black font-semibold"
              disabled={isLoading}
            >
              <LogIn className="h-4 w-4 mr-2" />
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-black mb-2">Demo Accounts:</h4>
            <div className="text-sm space-y-1">
              <p><strong>Admin:</strong> admin@lankanwheels.lk / admin123</p>
              <p><strong>Employee:</strong> kasun@lankanwheels.lk / emp123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
