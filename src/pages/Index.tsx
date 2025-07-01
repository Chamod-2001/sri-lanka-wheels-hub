
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bike, Car, Users, Settings, BarChart3, Wrench, LogIn, UserPlus } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import VehicleForm from "@/components/vehicles/VehicleForm";
import VehicleGrid from "@/components/vehicles/VehicleGrid";
import AdminDashboard from "@/components/admin/AdminDashboard";
import EmployeeDashboard from "@/components/employee/EmployeeDashboard";
import RepairTracking from "@/components/repair/RepairTracking";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, userRole, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("vehicles");

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 shadow-lg border-b-4 border-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-black p-2 rounded-lg">
                <Bike className="h-8 w-8 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Lankan Wheels</h1>
                <p className="text-sm text-gray-800">Vehicle Management System</p>
              </div>
            </div>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-black text-yellow-400 border-black">
                  {userRole?.toUpperCase()}
                </Badge>
                <span className="text-black font-medium">{user.name}</span>
                <Button 
                  onClick={logout}
                  variant="outline" 
                  className="border-black text-black hover:bg-black hover:text-yellow-400"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <LogIn className="h-5 w-5 text-black" />
                <span className="text-black font-medium">Please Login</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!user ? (
          <LoginForm onLogin={login} />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 bg-yellow-100 border border-yellow-300">
              <TabsTrigger value="vehicles" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                <Car className="h-4 w-4 mr-2" />
                Vehicles
              </TabsTrigger>
              <TabsTrigger value="add-vehicle" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Vehicle
              </TabsTrigger>
              <TabsTrigger value="repairs" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                <Wrench className="h-4 w-4 mr-2" />
                Repairs
              </TabsTrigger>
              {userRole === 'admin' && (
                <>
                  <TabsTrigger value="admin" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="employees" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                    <Users className="h-4 w-4 mr-2" />
                    Employees
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            <div className="mt-6">
              <TabsContent value="vehicles" className="space-y-6">
                <VehicleGrid userRole={userRole} />
              </TabsContent>

              <TabsContent value="add-vehicle" className="space-y-6">
                <VehicleForm />
              </TabsContent>

              <TabsContent value="repairs" className="space-y-6">
                <RepairTracking userRole={userRole} />
              </TabsContent>

              {userRole === 'admin' && (
                <>
                  <TabsContent value="admin" className="space-y-6">
                    <AdminDashboard />
                  </TabsContent>

                  <TabsContent value="employees" className="space-y-6">
                    <EmployeeDashboard />
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-6">
                    <Card className="border-yellow-300">
                      <CardHeader>
                        <CardTitle className="text-black">System Settings</CardTitle>
                        <CardDescription>Configure system preferences</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Settings panel coming soon...</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;
